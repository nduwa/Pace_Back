import { Op, Sequelize, where } from "sequelize";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import { Paged } from "../type";
import {
  FormAddDrug,
  FormAddExam,
  IAvailableMed,
  IForm,
  IFormConsultation,
  IFormConsultationRequest,
  IFormDTO,
  IFormDrug,
  IFormDrugDTO,
  IFormExam,
  IFormExamRequest,
  IFormInvoiceData,
  IFormInvoiceRequest,
  IFormRequest,
  IGiveDrugs,
  IInvoiceConsultationData,
  IInvoiceDrugData,
  IInvoiceExamData,
  IdrugOnInvoice,
  sendFormRequest,
} from "../type/form";
import FormModel from "../database/models/FormModel";
import Consultations from "../database/models/Consultations";
import FormConsultations from "../database/models/FormConsultations";
import FormExams from "../database/models/FormExams";
import ExamModel from "../database/models/ExamModel";
import DrugModel from "../database/models/DrugModel";
import FormDrugs from "../database/models/FormDrugs";
import ConsultationService from "./consultation.service";
import {
  IAddDrugsToInvoice,
  ICreateInvoiceDTO,
  IInvoice,
  IInvoiceConsultation,
  IInvoiceDTO,
  IInvoiceDrug,
  IInvoiceExam,
} from "../type/drugs";
import InvoiceService from "./invoice.service";
import CustomError from "../utils/CustomError";
import InvoiceModel from "../database/models/InvoiceModel";
import InvoiceDrugsModel from "../database/models/InvoiceDrugsModel";
import InvoiceExams from "../database/models/InvoiceExams";
import InvoiceConsultations from "../database/models/InvoiceConsultations";
import InstitutionExams from "../database/models/InstututionExams";
import { examPrice } from "../utils/helperFunctions";
import InstitutionModel from "../database/models/Institution";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import DrugService from "./drug.service";

class FormService {
  public static async getAll(
    institutionId: string | null,
    limit: number,
    offset: number,
    at: string | undefined,
    isOpen: string | undefined
  ): Promise<Paged<IFormDTO[]>> {
    let queryOptions: {
      [key: string]: any;
    } = {};

    const institutionOpt = {
      institutionId: institutionId,
    };

    const atOpt = at && at !== "all" ? { at: at } : {};

    let isOpenOpt = {};
    if (isOpen && isOpen == "no") isOpenOpt = { isOpen: false };
    if (isOpen && isOpen == "yes") isOpenOpt = { isOpen: true };

    queryOptions = { ...institutionOpt, ...atOpt, ...isOpenOpt };

    queryOptions = {
      ...queryOptions,
      ...institutionOpt,
    };

    const data = (await FormModel.findAll({
      where: queryOptions,
      ...TimestampsNOrder,
      limit,
      include: ["patient", "insurance"],
      offset,
    })) as unknown as IFormDTO[];

    const totalItems = await FormModel.count({
      where: {
        ...queryOptions,
      },
    });

    return { data, totalItems };
  }

  public static async getAllByLocation(
    institutionId: string | null,
    at: string | undefined
  ): Promise<IFormDTO[]> {
    let queryOptions: {
      [key: string]: any;
    } = {};

    const institutionOpt = {
      institutionId: institutionId,
    };

    const atOpt = at && at !== "all" ? { at: at } : {};

    queryOptions = { ...institutionOpt, ...atOpt };

    queryOptions = {
      ...queryOptions,
      ...institutionOpt,
    };

    const data = (await FormModel.findAll({
      where: queryOptions,
      ...TimestampsNOrder,
      include: ["patient"],
    })) as unknown as IFormDTO[];

    return data;
  }

  public static async getOne(id: string): Promise<IFormDTO> {
    const form = await FormModel.findByPk(id, {
      include: [
        "patient",
        "institution",
        "insurance",
        { model: FormDrugs, as: "drugs", include: ["drug"] },
        { model: FormExams, as: "exams", include: ["exam"] },
        {
          model: FormConsultations,
          as: "consultations",
          include: ["consultation"],
        },
      ],
    });

    return form as unknown as IFormDTO;
  }

  public static async getAllNPaged(
    institutionId: string | null
  ): Promise<IFormDTO[]> {
    const forms = await FormModel.findAll({
      where: {
        [Op.or]: [{ institutionId: null }, { institutionId: institutionId }],
      },
    });

    return forms as unknown as IFormDTO[];
  }

  public static async create(
    institutionId: string | null,
    data: IFormRequest
  ): Promise<IForm> {
    const insuranceUse = data.insuranceId && data.insuranceId.length > 0;

    const createForm = await FormModel.create({
      ...data,
      insuranceId: insuranceUse ? data.insuranceId : null,
      insuranceCard: insuranceUse ? data.insuranceCard : null,
      institutionId,
    });
    let form = createForm.toJSON();

    const consultation = await Consultations.findOne({
      where: { label: data.at },
    });
    if (consultation) {
      const cons = await this.addConsultation(form.id, consultation.id);
      form = { ...form, consultations: [cons] };
    }

    return form;
  }

  public static async update(id: string, data: IFormRequest): Promise<boolean> {
    try {
      await FormModel.update({ ...data }, { where: { id: id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  public static async delete(id: string): Promise<number> {
    return await FormModel.destroy({ where: { id: id } });
  }

  public static async addConsultation(formId: string, consultationId: string) {
    const form = await FormModel.findByPk(formId);
    const consultation = await Consultations.findByPk(consultationId);
    const [cons] = await FormConsultations.findOrCreate({
      where: { formId, consultationId },
      defaults: {
        formId,
        consultationId,
        patientId: form?.patientId,
        price: consultation?.price,
        verdict: "",
      },
    });

    return cons.toJSON();
  }

  public static async addExam(formId: string, data: FormAddExam) {
    const form = await FormModel.findByPk(formId);
    if (form == null) throw new CustomError("Form not found");

    const exam = await ExamModel.findByPk(data.examId);

    if (exam == null) throw new CustomError("Exam not found");

    const [addedExam] = await FormExams.findOrCreate({
      where: { formId, examId: data.examId },
      defaults: {
        formId,
        examId: data.examId,
        patientId: form?.patientId,
      },
    });

    return addedExam.toJSON();
  }

  public static async addDrug(formId: string, data: FormAddDrug) {
    const form = await FormModel.findByPk(formId);
    const drug = await DrugModel.findByPk(data.drugId);

    const [addedDrug] = await FormDrugs.findOrCreate({
      where: { formId, drugId: data.drugId },
      defaults: {
        formId,
        drugId: data.drugId,
        patientId: form?.patientId,
        quantity: data.quantity,
        prescription: data.prescription,
      },
    });

    return addedDrug.toJSON();
  }

  public static async consultation(
    data: IFormConsultationRequest,
    formId: string,
    userId: string
  ) {
    const consultation = await this.addConsultation(
      formId,
      data.consultationId
    );

    await FormConsultations.update(
      {
        verdict: data.verdict,
        userId,
      },
      { where: { id: consultation.id } }
    );

    let drugIds: string[] = [],
      examIds: string[] = [];

    await Promise.all(
      data.drugs.map(async (drug) => {
        await this.addDrug(formId, drug);
        drugIds.push(drug.drugId);
      })
    );

    await Promise.all(
      data.exams.map(async (exam) => {
        examIds.push(exam.examId);
        await this.addExam(formId, exam);
      })
    );

    // Delete those that are not saved
    await FormDrugs.destroy({
      where: { formId: formId, drugId: { [Op.notIn]: drugIds } },
    });
    await FormExams.destroy({
      where: { formId: formId, examId: { [Op.notIn]: examIds } },
    });

    return this.getOne(formId);
  }

  public static async examination(
    data: IFormExamRequest,
    formId: string,
    userId: string,
    institutionId: string
  ) {
    data.exams.forEach(async (exam) => {
      const examData = await this.addExam(formId, exam);

      const existingData = await FormExams.findOne({
        where: { formId, examId: exam.examId },
      });

      const institution = exam.result == null ? null : institutionId;

      await FormExams.update(
        {
          result: exam.result,
          comment: exam.comment,
          userId: existingData?.invoiceId == null ? userId : undefined,
          institutionId:
            existingData?.invoiceId == null ? institution : undefined,
        },
        { where: { id: examData.id } }
      );
    });

    return this.getOne(formId);
  }

  public static async sendFormTo(
    formId: string,
    data: sendFormRequest
  ): Promise<number> {
    const form = await FormModel.findByPk(formId);
    const { to } = data;
    const consultation = await Consultations.findOne({
      where: { label: to },
    });
    if (consultation) {
      this.addConsultation(formId, consultation.id);
    }
    let update: { [key: string]: any } = {
      at: to,
      from: form?.at,
      isOpen: true,
    };
    if (data.to === "ARCHIVE") {
      update.isOpen = false;
    }

    const [res] = await FormModel.update(
      { ...update },
      { where: { id: formId } }
    );

    return res;
  }

  public static async getLocations(institutionId: string) {
    const consultations = await ConsultationService.getAllNPaged(institutionId);

    const institution = await InstitutionModel.findByPk(institutionId);
    const pharmacy = institution?.hasPharmacy === true ? ["PHARMACY"] : [];
    return [
      ...consultations.map((c) => c.label),
      "LABORATORY",
      ...pharmacy,
      "COUNTER",
      "RECEIPTION",
      "ARCHIVE",
    ];
  }

  public static async invoiceDrugs(
    data: ICreateInvoiceDTO,
    userId: string,
    institutionId: string
  ): Promise<IInvoiceDTO> {
    let Invoice = await InvoiceService.create(data, userId, institutionId);

    return Invoice;
  }

  public static async possibleTobeInvoiced(
    formId: string,
    institutionId: string,
    userId: string
  ): Promise<IFormInvoiceData> {
    let invoiceDrugs: IInvoiceDrugData[] = [],
      invoiceExams: IInvoiceExamData[] = [],
      invoiceConsultations: IInvoiceConsultationData[] = [];
    const form = await this.getOne(formId);

    let invoice = await InvoiceModel.findOne({
      where: { institutionId, formId, published: false },
      include: [{ model: InvoiceDrugsModel, as: "drugs", include: ["drug"] }],
    }).then((inv) => {
      invoiceDrugs =
        inv?.drugs.map((drug) => {
          return {
            id: drug.drug.id,
            drug: drug.drug,
            unitPrice: drug.unitPrice,
            quantity: drug.quantity,
            totalPrice: drug.totalPrice,
          } as unknown as IInvoiceDrugData;
        }) || [];

      return inv;
    });

    const consultations = await Consultations.findAll({
      where: { institutionId },
    });
    const consultationIds = consultations.map((cons) => cons.id);

    await FormConsultations.findAll({
      where: {
        formId,
        consultationId: { [Op.in]: consultationIds },
        invoiceId: { [Op.is]: null },
      },
      include: ["consultation"],
    }).then((cons) => {
      invoiceConsultations = cons.map((c) => {
        return {
          id: c.consultationId,
          consultation: c.consultation,
          price: c.consultation.price,
        };
      });
    });

    await FormExams.findAll({
      where: {
        formId,
        invoiceId: { [Op.is]: null },
      },
      include: [
        {
          model: ExamModel,
          as: "exam",
          include: [
            {
              model: InstitutionExams,
              as: "institutionExam",
              required: false,
              where: { institutionId },
            },
          ],
        },
      ],
    }).then((exam) => {
      invoiceExams = exam
        .filter((ex) => ex.institutionId == institutionId)
        .map((ex) => {
          return {
            id: ex.examId,
            exam: ex.exam,
            price: examPrice(ex.exam),
          };
        });
    });

    if (invoice == null)
      invoice = await InvoiceModel.create({
        name: form?.patient?.name,
        phone: form?.patient?.phone,
        patientId: form?.patientId,
        formId: form?.id,
        institutionId: institutionId,
        userId: userId,
        type: "CLINICAL_RECORD",
        totalCost: 0,
        published: false,
        note: "Invoice",
      });

    return {
      invoice,
      form,

      invoiceDrugs,
      invoiceExams,
      invoiceConsultations,
    };
  }

  public static async saveInvoice(data: IFormInvoiceRequest, id: string) {
    const invoice = await InvoiceModel.findByPk(id);
    if (invoice == null) throw new CustomError("Invoice not found");

    let totalCost = 0;
    let examData: Partial<IInvoiceExam>[] = [],
      examCost = 0;
    let consultationData: Partial<IInvoiceConsultation>[] = [],
      consultationCost = 0;

    let drugCost = 0;

    data.invoiceDrugs.forEach((drug) => {
      drugCost += drug.totalPrice;
    });
    totalCost += drugCost;

    data.invoiceExams.forEach((exam) => {
      examData.push({
        examId: exam.id,
        patientId: invoice.patientId,
        price: exam.price,
        invoiceId: invoice.id,
        institutionId: invoice.institutionId,
      });

      examCost += exam.price;
    });

    data.invoiceConsultations.forEach((consultation) => {
      consultationData.push({
        consultationId: consultation.id,
        patientId: invoice.patientId,
        price: consultation.price,
        invoiceId: invoice.id,
        institutionId: invoice.institutionId,
      });

      consultationCost += consultation.price;
    });

    const examsSave = await InvoiceExams.bulkCreate(examData);
    if (examsSave.length == examData.length) {
      // All saved
      totalCost += examCost;
      const examIds = examData.map((i) => i.examId);
      await FormExams.update(
        { invoiceId: invoice.id },
        { where: { formId: invoice.formId, examId: { [Op.in]: examIds } } }
      );
    }

    const consultationsSave = await InvoiceConsultations.bulkCreate(
      consultationData
    );
    if (consultationsSave.length == consultationData.length) {
      // All saved
      totalCost += consultationCost;
      const consultationIds = consultationData.map((i) => i.consultationId);
      await FormConsultations.update(
        { invoiceId: invoice.id },
        {
          where: {
            formId: invoice.formId,
            consultationId: { [Op.in]: consultationIds },
          },
        }
      );
    }

    //  Add cost and publish invoice
    await InvoiceModel.update(
      { totalCost, published: true },
      { where: { id } }
    );

    return true;
  }

  public static async getAvailableMedForForm(
    formId: string,
    institutionId: string
  ) {
    const form = await FormModel.findByPk(formId, {
      include: [{ model: FormDrugs, as: "drugs", include: ["drug"] }],
    });

    if (!form) throw new CustomError("Form not found");

    let drugs: IAvailableMed = {
      addToInvoice: [],
      alreadyOnInvoice: [],
    };
    const formDrugs = form.drugs.filter((d) => d.quantity > d.givenQuantity);
    await Promise.all(
      formDrugs.map(async (formDrug) => {
        const possibleDrugs = await InstitutionDrugs.findAll({
          where: {
            drugId: formDrug.drugId,
            institutionId: institutionId,
            quantity: { [Op.gt]: 0 },
          },
          include: ["drug"],
        });
        const possibleDrugsWithPrices = await DrugService.getPrices(
          possibleDrugs
        );
        const formD = formDrug as unknown as IFormDrug;
        drugs.addToInvoice.push({
          quantity: formDrug.quantity - formDrug.givenQuantity,
          formDrug: formD,
          formDrugId: formD.id,
          drug: formDrug.drug,
          drugsAvailable: possibleDrugsWithPrices,
        });
      })
    );

    let invoice = await InvoiceModel.findAll({
      where: { institutionId, formId },
      include: [{ model: InvoiceDrugsModel, as: "drugs", include: ["drug"] }],
    });

    await Promise.all(
      invoice?.map(async (inv) => {
        let d: IdrugOnInvoice[] = [];

        await Promise.all(
          inv.drugs.map(async (drug) => {
            const formDrug = await FormDrugs.findOne({
              where: { formId, drugId: drug.drugId },
            });

            d.push({
              id: drug.drug.id,
              drug: drug.drug,
              unitPrice: drug.unitPrice,
              quantity: drug.quantity,
              totalPrice: drug.totalPrice,
              formDrug: formDrug as unknown as IFormDrug,
              invoiceDrug: drug,
            });
          })
        );

        if (d.length > 0) {
          drugs.alreadyOnInvoice.push({ invoice: inv, data: d });
        }
      })
    );

    const alreadyOnInvoice = drugs.alreadyOnInvoice.flatMap((i) =>
      i.data.map((d) => d?.drug?.id)
    );
    drugs.addToInvoice = drugs.addToInvoice.filter(
      (i) => !alreadyOnInvoice.includes(i.drug.id)
    );

    return drugs;
  }

  // public static async addDrugsToInvoice(
  //   data: IAddDrugsToInvoice,
  //   userId: string,
  //   institutionId: string,
  //   formId: string,
  // ): Promise<IInvoiceDTO> {

  //   const form = await FormModel.findByPk(formId, {include: ['patient']});

  //   const invoice = await InvoiceModel.findOrCreate({where: {formId, institutionId, published: false}, defaults: {
  //     formId: formId,
  //     institutionId,
  //     userId,
  //     published: false,
  //     patientId: form?.patientId,
  //     name: form?.patient.name,
  //     phone: form?.patient.phone,
  //   }});

  //   const prescribedDrugs = await FormDrugs.findAll({
  //     where: { formId },
  //     include: ["drug"],
  //   });

  //   //   check quantity

  //   let error: string | undefined = undefined;

  //   await Promise.all(
  //     data.drugs.map(async (drug, index) => {
  //       const drugJSON = prescribedDrugs.find(
  //         (d) => d.id == drug.drug
  //       ) as unknown as IFormDrugDTO;

  //       const requiredQuantity = drugJSON.quantity - drugJSON.givenQuantitty;

  //       if (drug.qty > requiredQuantity) {
  //         error = `${drugJSON?.drug?.designation} requires only ${requiredQuantity}`;
  //       }
  //     })
  //   );

  //   if (error) {
  //     throw new CustomError(error, 400);
  //   }

  //   await Promise.all(
  //     data.drugs.map(async (drug, index) => {

  //       const institution
  //       const drugJSON = prescribedDrugs.find(
  //         (d) => d.id == drug.drug
  //       ) as unknown as IFormDrugDTO;

  //       const requiredQuantity = drugJSON.quantity - drugJSON.givenQuantitty;

  //       if (drug.qty > requiredQuantity) {
  //         error = `${drugJSON?.drug?.designation} requires only ${requiredQuantity}`;
  //       }
  //     })
  //   );

  //   const existingInvoice = await InvoiceModel.findOne({
  //     where: { formId, institutionId, isOpen: true, published: false },
  //   });
  //   if (existingInvoice !== null) {
  //     // move drugs
  //     await InvoiceDrugsModel.update(
  //       { invoiceId: existingInvoice.id },
  //       { where: { formId, invoiceId: Invoice.id } }
  //     );
  //     await InvoiceModel.destroy({ where: { id: Invoice.id } });
  //     Invoice = (await InvoiceService.getOne(
  //       existingInvoice.id
  //     )) as IInvoiceDTO;
  //   }

  //   return Invoice;
  // }

  public static async removeDrugFromInvoice(drugId: string) {
    const invoiceDrug = await InvoiceDrugsModel.findByPk(drugId, {
      include: ["invoice"],
    });

    if (!invoiceDrug) throw new CustomError("Not found");
    if (invoiceDrug?.invoice.published)
      throw new CustomError("Invoice has alredy been saved");

    await InvoiceDrugsModel.destroy({ where: { id: drugId } });

    await InvoiceModel.update(
      { totalCost: invoiceDrug?.invoice.totalCost - invoiceDrug?.totalPrice },
      { where: { id: invoiceDrug.invoiceId } }
    );
  }

  public static async giveDrugs(data: IGiveDrugs, formId: string) {
    const form = await FormModel.findByPk(formId);
  }
}

export default FormService;
