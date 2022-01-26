import { CompleteTicketRequest, SubmitTicketPriceRequest } from "@client/models";
import { strictEqual } from "assert";
import { FieldContext } from "vee-validate";
import { computed, WritableComputedRef } from "vue";
import { InferType } from "yup";

const fieldState = (context: FieldContext<unknown>) => ({
  message: context.meta.validated ? context.errorMessage.value : undefined,
  variant: context.errorMessage.value ? "danger" : undefined,
});

const TicketInformationModel = CompleteTicketRequest.pick(["ticketId", "information"]);
type TicketInformationModel = InferType<typeof TicketInformationModel>;

const TicketPriceModel = SubmitTicketPriceRequest.pick(["price", "ticketId"]);
type TicketPriceModel = InferType<typeof TicketPriceModel>;

const numberFieldMap = (
  field: FieldContext<number>,
  def: any = undefined
): WritableComputedRef<number> =>
  computed({
    get: () => field.value.value,
    set: (str) => {
      if (!str) {
        field.value.value = def;
      }

      const value = parseFloat(str as unknown as string);

      field.value.value = isNaN(value) ? def : value;
    },
  });

export { fieldState, TicketInformationModel, TicketPriceModel, numberFieldMap };
