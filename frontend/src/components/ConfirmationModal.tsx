import { Button, Dialog, Flex, Text } from "@radix-ui/themes";

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
      <Dialog.Content maxWidth="24rem" style={{ textAlign: "center" }}>
        <Dialog.Title>
          <Text size="4" weight="medium" mb="4">
            確認
          </Text>
        </Dialog.Title>

        <Dialog.Description>
          <Text color="gray" mb="6">
            {message}
          </Text>
        </Dialog.Description>

        <Flex justify="center" gap="4">
          <Button onClick={onConfirm} color="red" variant="solid" size="2">
            はい
          </Button>
          <Button onClick={onCancel} color="gray" variant="soft" size="2">
            いいえ
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
