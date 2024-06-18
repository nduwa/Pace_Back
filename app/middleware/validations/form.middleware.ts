import { z } from "zod";

export const consultationSchema = z.object({
  body: z.object({
    verdict: z.string().min(1, "Verdict is required"),
    consultationId: z.string().min(1, "Consultation id is required"),
    drugs: z.array(
      z.object({
        drugId: z.string().min(1, "Drug is required"),
        quantity: z.number().min(0.1, "Invalid quantity"),
        prescription: z.string().min(1, "Prescription required"),
      })
    ),
    exams: z.array(
      z.object({
        examId: z.string().min(1, "Exam is required"),
      })
    ),
  }),
});

export const formSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "PatientId is required"),
    at: z.string().min(1, "Select where to send the form"),
    details: z.any(),
  }),
});

export const examSchema = z.object({
  body: z.object({
    exams: z.array(
      z.object({
        examId: z.string().min(1, "Exam is required"),
        result: z.boolean().nullable(),
        comment: z.string(),
      })
    ),
  }),
});

export const sendFromSchema = z.object({
  body: z.object({
    to: z.string(),
  }),
});

const IInvoiceExamDataSchema = z.object({
  id: z.string(),
  price: z.number(),
});

const IInvoiceConsultationDataSchema = z.object({
  id: z.string(),
  price: z.number(),
});

const IInvoiceDrugDataSchema = z.object({
  id: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
  totalPrice: z.number(),
});

export const formInvoiceRequestSchema = z.object({
  body: z.object({
    invoiceConsultations: z.array(IInvoiceConsultationDataSchema),
    invoiceExams: z.array(IInvoiceExamDataSchema),
    invoiceDrugs: z.array(IInvoiceDrugDataSchema),
  }),
});
