type ModifyMode = "create" | "update";

type ModalPath = "main" | "other";

// TODO move into Modal.vue when exports are allowed
type ModalProps = {
  title: string;

  mainButtonText: string;
  mainButtonVariant?: string;
  mainButtonDisabled?: boolean;

  altButtonText?: string;
  altButtonVariant?: string;
  altButtonDisabled?: boolean;

  loading?: boolean;
};

export { ModifyMode, ModalPath, ModalProps };
