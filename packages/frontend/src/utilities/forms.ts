import { CompleteTicketRequest, SubmitTicketPriceRequest, UpdateUserRequest } from "@client/models";
import { FieldContext } from "vee-validate";
import { computed, WritableComputedRef } from "vue";
import { InferType } from "yup";

const fieldState = (context: FieldContext<unknown>) => ({
  message: context.meta.validated ? context.errorMessage.value : undefined,
  variant: context.errorMessage.value ? "danger" : undefined,
});

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

const TicketInformationModel = CompleteTicketRequest.pick(["ticketId", "information"]);
type TicketInformationModel = InferType<typeof TicketInformationModel>;

const TicketPriceModel = SubmitTicketPriceRequest.pick(["price", "ticketId"]);
type TicketPriceModel = InferType<typeof TicketPriceModel>;

export { fieldState, TicketInformationModel, TicketPriceModel, numberFieldMap };
