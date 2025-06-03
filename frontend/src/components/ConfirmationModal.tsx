import { Button, Dialog } from "@radix-ui/themes";

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function ConfirmationModal({
  message,
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmationModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content maxWidth="24rem" className="text-center">
        <Dialog.Title className="mb-4 font-semibold text-lg">確認</Dialog.Title>

        <Dialog.Description className="mb-6 text-gray-700">
          {message}
        </Dialog.Description>

        <div className="flex justify-center space-x-4">
          <Button onClick={onConfirm} color="red" variant="solid" size="2">
            はい
          </Button>
          <Button onClick={onCancel} color="gray" variant="soft" size="2">
            いいえ
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
