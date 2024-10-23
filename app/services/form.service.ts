import { Op, Sequelize, where } from "sequelize";
import { QueryOptions, TimestampsNOrder } from "../utils/DBHelpers";
import { Paged } from "../type";
import {
  FormAddDrug,
  FormAddAct,
  IAvailableMed,
  IForm,
  IFormConsultation,
  IFormConsultationRequest,
  IFormDTO,
  IFormDrug,
  IFormDrugDTO,
  IFormAct,
  IFormActRequest,
  IFormInvoiceData,
  IFormInvoiceRequest,
  IFormRequest,
  IGiveDrugs,
  IInvoiceConsultationData,
  IInvoiceDrugData,
  IInvoiceActData,
  IdrugOnInvoice,
  sendFormRequest,
} from "../type/form";
import FormModel from "../database/models/FormModel";
import Consultations from "../database/models/Consultations";
import FormConsultations from "../database/models/FormConsultations";
import FormActs from "../database/models/FormActs";
import ExamModel from "../database/models/ExamModel";
import DrugModel from "../database/models/DrugModel";
import FormDrugs from "../database/models/FormDrugs";
import ConsultationService from "./consultation.service";
import {
  ICreateInvoiceDTO,
  IInvoiceConsultation,
  IInvoiceDTO,
  IInvoiceAct,
  IInvoiceDrugCreateDTO,
} from "../type/drugs";
import InvoiceService from "./invoice.service";
import CustomError from "../utils/CustomError";
import InvoiceModel from "../database/models/InvoiceModel";
import InvoiceDrugsModel from "../database/models/InvoiceDrugsModel";
import InvoiceActs from "../database/models/InvoiceActs";
import InvoiceConsultations from "../database/models/InvoiceConsultations";
import InstitutionExams from "../database/models/InstututionExams";
import { actPrice, examPrice } from "../utils/helperFunctions";
import InstitutionModel from "../database/models/Institution";
import InstitutionDrugs from "../database/models/InstututionDrugs";
import DrugService from "./drug.service";
import Service from "../database/models/Services";
import ServiceAct from "../database/models/ServiceAct";
import InstitutionAct from "../database/models/InstututionAct";
import { IServiceAct } from "../type/service";
import UserModel from "../database/models/UserModel";
import InsuranceDrugs from "../database/models/InsuranceDrugs";
import { IConsultation, IConsultationRequest } from "../type/instutution";
import { IUser } from "../type/auth";

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
        { model: FormDrugs, as: "drugs", include: ["drug", "insuranceDrug"] },
        { model: FormActs, as: "acts", include: ["act"] },
        {
          model: FormConsultations,
          as: "consultations",
          include: [
            {
              model: Consultations,
              as: "consultation",
              paranoid: false,
              include: [
                {
                  model: Service,
                  as: "service",
                  include: ["acts"],
                },
              ],
            },
          ],
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

    await this.sendFormTo(form.id, { to: form.at });

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

  public static async addAct(
    formId: string,
    formConsultationId: string,
    data: FormAddAct
  ) {
    const form = await FormModel.findByPk(formId, { include: ["patient"] });
    if (form == null) throw new CustomError("Form not found");

    const serviceAct = await ServiceAct.findByPk(data.serviceActId);

    if (serviceAct == null) throw new CustomError("Act not found");

    const [addedAct, created] = await FormActs.findOrCreate({
      where: { formId, serviceActId: data.serviceActId, formConsultationId },
      defaults: {
        formId,
        patientId: form?.patientId,
        formConsultationId,
        ...data,
      },
    });

    if (!created) {
      await addedAct.update({ ...data });
    }

    return addedAct.toJSON();
  }

  public static async addDrug(
    formId: string,
    formConsultationId: string | null,
    data: FormAddDrug
  ): Promise<IFormDrug> {
    const form = await FormModel.findByPk(formId);
    const drug = await InstitutionDrugs.findByPk(data.drugId);

    const drugData = {
      formId,
      drugId: drug?.drugId,
      institutionDrugId: drug?.id,
      insuranceDrugId: drug?.insuranceDrugId,
      patientId: form?.patientId,
      quantity: data.quantity,
      prescription: data.prescription,
      formConsultationId,
      isMaterial: data.isMaterial,
    };

    const [addedDrug, created] = await FormDrugs.findOrCreate({
      where: { formId, institutionDrugId: data.drugId, formConsultationId },
      defaults: {
        ...drugData,
      },
    });

    if (!created) {
      await addedDrug.update({ ...drugData });
    }

    return addedDrug.toJSON();
  }

  public static async consultation(
    data: IFormConsultationRequest,
    formId: string,
    userId: string
  ) {
    const form = await FormModel.findByPk(formId, { include: ["patient"] });
    const user = await UserModel.findByPk(userId);

    if (!form) throw new CustomError("Form not found");

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

    let actIds: string[] = [];

    await Promise.all(
      data.acts.map(async (act) => {
        actIds.push(act.serviceActId);
        await this.addAct(formId, consultation.id, act);
      })
    );

    await FormActs.destroy({
      where: {
        formId: formId,
        serviceActId: { [Op.notIn]: actIds },
        formConsultationId: consultation.id,
      },
    });

    await this.materials(
      form as unknown as IFormDTO,
      consultation,
      data,
      user as IUser
    );

    return this.getOne(formId);
  }

  public static async materials(
    form: IFormDTO,
    consultation: IConsultation,
    data: IFormConsultationRequest,
    user: IUser
  ) {
    let priorInvoice = await InvoiceModel.findOne({
      where: { formId: form.id, published: false },
    });

    if (priorInvoice) {
      console.log("has invoice already");

      await InvoiceService.clearMaterialsOnInvoice(
        consultation.id,
        priorInvoice
      );
    }
    let drugIds: string[] = [],
      formId = form.id;

    const drugData: IInvoiceDrugCreateDTO[] = [];

    await Promise.all(
      data.drugs.map(async (drug) => {
        const formDrug = await this.addDrug(formId, consultation.id, {
          ...drug,
          isMaterial: true,
        });
        drugIds.push(drug.drugId);
        drugData.push({
          drug: drug.drugId,
          qty: drug.quantity,
          formDrugId: formDrug.id,
        });
      })
    );

    const invoice = await InvoiceService.create(
      {
        formId: formId,
        insuranceId: form?.insuranceId ?? undefined,
        insuranceCard: form?.insuranceCard ?? undefined,
        published: false,
        note: "Materials",
        name: form?.patient?.name || "",
        phone: form?.patient?.phone || "",
        patientId: form?.patientId,
        drugs: drugData.map((d, index) => ({
          drug: d.drug,
          qty: d.qty,
          formDrugId: d.formDrugId,
        })),
      },
      user.id,
      user?.institutionId as string
    );

    console.log("back to form");

    // Delete those that are not saved
    await FormDrugs.destroy({
      where: {
        formId: formId,
        institutionDrugId: { [Op.notIn]: drugIds },
        formConsultationId: consultation.id,
      },
    });
  }

  public static async sendFormTo(
    formId: string,
    data: sendFormRequest
  ): Promise<number> {
    const form = await FormModel.findByPk(formId);
    const { to } = data;
    const consultation = await Consultations.findOne({
      include: [
        {
          model: Service,
          as: "service",
          where: {
            label: to,
          },
          required: true,
        },
      ],
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
      ...consultations.map((c) => c.service?.label || ""),
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
      invoiceActs: IInvoiceActData[] = [],
      invoiceConsultations: IInvoiceConsultationData[] = [];
    const form = await this.getOne(formId);

    let invoice = await InvoiceModel.findOne({
      where: { institutionId, formId, published: false },
      include: [
        {
          model: InvoiceDrugsModel,
          as: "drugs",
          include: ["drug", "insuranceDrug"],
        },
      ],
    }).then((inv) => {
      invoiceDrugs =
        inv?.drugs.map((drug) => {
          return {
            id: drug.institutionDrugId,
            insuranceDrugId: drug.drug?.id,
            drug: drug.drug,
            insuranceDrug: drug.insuranceDrug,
            unitPrice: drug.unitPrice,
            quantity: drug.quantity,
            totalPrice: drug.totalPrice,
          } as unknown as IInvoiceDrugData;
        }) || [];

      return inv;
    });

    await FormActs.findAll({
      where: {
        formId,
        invoiceId: { [Op.is]: null },
      },
      include: [
        {
          model: ServiceAct,
          as: "act",
          include: [
            {
              model: InstitutionAct,
              as: "institutionAct",
              required: false,
              where: { institutionId },
            },
          ],
        },
      ],
    }).then((acts) => {
      invoiceActs = acts
        .filter((a) => a.done)
        .map((a) => {
          console.log("act", actPrice(a.act as unknown as IServiceAct));
          return {
            id: a.serviceActId,
            act: a.act,
            price: actPrice(a.act as unknown as IServiceAct),
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
      invoiceActs,
      invoiceConsultations,
    };
  }

  public static async saveInvoice(data: IFormInvoiceRequest, id: string) {
    const invoice = await InvoiceModel.findByPk(id);
    if (invoice == null) throw new CustomError("Invoice not found");

    let totalCost = 0;
    let actData: Partial<IInvoiceAct>[] = [],
      examCost = 0;
    let consultationData: Partial<IInvoiceConsultation>[] = [],
      consultationCost = 0;

    let drugCost = 0;

    data.invoiceDrugs.forEach((drug) => {
      drugCost += drug.totalPrice;
    });
    totalCost += drugCost;

    data.invoiceActs.forEach((exam) => {
      actData.push({
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

    const examsSave = await InvoiceActs.bulkCreate(actData);
    if (examsSave.length == actData.length) {
      // All saved
      totalCost += examCost;
      const examIds = actData.map((i) => i.examId);
      await FormActs.update(
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

  public static async examination(
    data: IFormActRequest,
    formId: string,
    userId: string,
    institutionId: string
  ) {
    data.acts.forEach(async (act) => {
      const actData = await this.addAct(formId, data.consultationId, act);

      const existingData = await FormActs.findOne({
        where: {
          formId,
          serviceActId: act.serviceActId,
          formConsultationId: data.consultationId,
        },
      });

      const institution = act.done == false ? null : institutionId;

      await FormActs.update(
        {
          done: act.done,
          comment: act.comment,
          userId: existingData?.invoiceId == null ? userId : undefined,
          institutionId:
            existingData?.invoiceId == null ? institution : undefined,
        },
        { where: { id: actData.id } }
      );
    });

    return this.getOne(formId);
  }

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
