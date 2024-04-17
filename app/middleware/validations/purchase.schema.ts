import { Body } from "tsoa";
import { z } from "zod";

const isUniqueDrugStock = (drugs: Array<{ drug: string }>) => {
  const drugSet = new Set<string>();
  for (const { drug } of drugs) {
    if (drugSet.has(drug)) {
      return false;
    }
    drugSet.add(drug);
  }
  return true;
};

export const createPurchaseSchema = z.object({
  body: z.object({
    note: z.string().optional(),
    date: z.string().min(10, "Valid date is required"),
    supplier: z.string().optional(),
    drugs: z
      .array(
        z.object({
          drug: z
            .string({ required_error: "select Drug" })
            .min(4, { message: "invalid Drug" }),
          qty: z.number({ invalid_type_error: "Quantity must be a number" }),
          unitPrice: z.number({
            invalid_type_error: "Price must be a number",
          }),
          sellingPrice: z.number({
            invalid_type_error: "Price must be a number",
          }),
        })
      )
      .min(1)
      .refine((data) => isUniqueDrugStock(data), {
        message: "Drug must be unique",
      }),
  }),
});

const isBatchNumberUnique = (drugs: Array<{ batchNumber: string }>) => {
  const drugSet = new Set<string>();
  for (const { batchNumber } of drugs) {
    if (drugSet.has(batchNumber!)) {
      return false;
    }
    if (batchNumber.trim().length > 0) {
      drugSet.add(batchNumber);
    }
  }
  return true;
};

export const purchaseDrugsSchema = z.object({
  body: z.object({
    drugs: z
      .array(
        z.object({
          id: z.string(),
          batchNumber: z.string().optional(),
        })
      )
      .refine(
        (data) =>
          isBatchNumberUnique(
            data.map((drug) => ({
              batchNumber: drug.batchNumber as string,
            }))
          ),
        { message: "Batch numbers has to be unique" }
      ),
  }),
});

export type IPurchaseDrugs = z.infer<typeof purchaseDrugsSchema>;
