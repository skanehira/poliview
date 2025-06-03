import * as Form from "@radix-ui/react-form";
import {
  Button,
  Dialog,
  Flex,
  Grid,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { type FormEvent, useState } from "react";
import type { NewPolicy } from "../types/policy";

interface PolicyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPolicy: (policy: NewPolicy) => void;
}

export function PolicyAddModal({
  isOpen,
  onClose,
  onAddPolicy,
}: PolicyAddModalProps) {
  const initialNewPolicyData = {
    title: "",
    purpose: "",
    overview: "",
    detailedPlan: "",
    problems: "",
    benefits: "",
    drawbacks: "",
    year: new Date().getFullYear(),
    keywords: "",
    relatedEvents: "",
    budget: "",
    status: "進行中",
  };

  const [newPolicyData, setNewPolicyData] = useState(initialNewPolicyData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewPolicyData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const policyToAdd: NewPolicy = {
      ...newPolicyData,
      benefits: newPolicyData.benefits
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      drawbacks: newPolicyData.drawbacks
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      keywords: newPolicyData.keywords
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      relatedEvents: newPolicyData.relatedEvents
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      problems: newPolicyData.problems
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      year: Number.parseInt(String(newPolicyData.year), 10),
      budget: Number.parseInt(newPolicyData.budget, 10) || 0,
    };
    onAddPolicy(policyToAdd);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewPolicyData(initialNewPolicyData);
    setHasUnsavedChanges(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmClose(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    resetForm();
    setShowConfirmClose(false);
    onClose();
  };

  const handleCancelDiscard = () => {
    setShowConfirmClose(false);
  };

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <Dialog.Content
          maxWidth="48rem"
          className="relative max-h-[90vh] overflow-y-auto"
        >
          <Dialog.Description className="sr-only">
            新しい政策を追加するためのフォーム
          </Dialog.Description>
          <Flex justify="between" align="start" mb="4">
            <Dialog.Title className="font-semibold text-blue-700 text-xl">
              新しい政策を追加
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                &times;
              </Button>
            </Dialog.Close>
          </Flex>

          <Form.Root onSubmit={handleSubmit}>
            <Grid columns={{ initial: "1", md: "2" }} gap="4">
              <Form.Field name="title">
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      政策タイトル
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="title"
                      value={newPolicyData.title}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing">
                    <Text size="1" color="red">
                      政策タイトルを入力してください
                    </Text>
                  </Form.Message>
                </Flex>
              </Form.Field>
              <Form.Field name="year">
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      年度
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="year"
                      type="number"
                      value={newPolicyData.year}
                      onChange={handleFormChange}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing">
                    <Text size="1" color="red">
                      年度を入力してください
                    </Text>
                  </Form.Message>
                </Flex>
              </Form.Field>
              <Form.Field name="purpose" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      政策の目的
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextArea
                      name="purpose"
                      value={newPolicyData.purpose}
                      onChange={handleFormChange}
                      rows={3}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing">
                    <Text size="1" color="red">
                      政策の目的を入力してください
                    </Text>
                  </Form.Message>
                </Flex>
              </Form.Field>
              <Form.Field name="overview" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      政策の概要
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextArea
                      name="overview"
                      value={newPolicyData.overview}
                      onChange={handleFormChange}
                      rows={3}
                      required
                    />
                  </Form.Control>
                  <Form.Message match="valueMissing">
                    <Text size="1" color="red">
                      政策の概要を入力してください
                    </Text>
                  </Form.Message>
                </Flex>
              </Form.Field>
              <Form.Field name="detailedPlan" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      具体的計画の内容
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextArea
                      name="detailedPlan"
                      value={newPolicyData.detailedPlan}
                      onChange={handleFormChange}
                      rows={3}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="problems" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      解決したい問題点 (カンマ区切り)
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="problems"
                      value={newPolicyData.problems}
                      onChange={handleFormChange}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="benefits" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      メリット (カンマ区切り)
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="benefits"
                      value={newPolicyData.benefits}
                      onChange={handleFormChange}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="drawbacks" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      デメリット (カンマ区切り)
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="drawbacks"
                      value={newPolicyData.drawbacks}
                      onChange={handleFormChange}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="keywords" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      キーワード (カンマ区切り)
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="keywords"
                      value={newPolicyData.keywords}
                      onChange={handleFormChange}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="relatedEvents" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      政策に関するイベント (カンマ区切り)
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="relatedEvents"
                      value={newPolicyData.relatedEvents}
                      onChange={handleFormChange}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="budget" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      予算 (円)
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      name="budget"
                      type="number"
                      value={newPolicyData.budget}
                      onChange={handleFormChange}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
              <Form.Field name="status" style={{ gridColumn: "1 / -1" }}>
                <Flex direction="column" gap="1">
                  <Form.Label asChild>
                    <Text size="2" weight="medium">
                      ステータス
                    </Text>
                  </Form.Label>
                  <Select.Root
                    value={newPolicyData.status}
                    onValueChange={(value) =>
                      setNewPolicyData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <Select.Trigger style={{ width: "100%" }} />
                    <Select.Content>
                      <Select.Item value="進行中">進行中</Select.Item>
                      <Select.Item value="完了">完了</Select.Item>
                      <Select.Item value="中止">中止</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Form.Message match="valueMissing">
                    <Text size="1" color="red">
                      ステータスを選択してください
                    </Text>
                  </Form.Message>
                </Flex>
              </Form.Field>
              <Flex justify="end" style={{ gridColumn: "1 / -1" }}>
                <Form.Submit asChild>
                  <Button variant="solid" color="blue" size="3">
                    政策を保存
                  </Button>
                </Form.Submit>
              </Flex>
            </Grid>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Root>

      {/* Confirmation dialog for unsaved changes */}
      {showConfirmClose && (
        <Dialog.Root
          open={showConfirmClose}
          onOpenChange={(open) => !open && handleCancelDiscard()}
        >
          <Dialog.Content maxWidth="24rem" className="text-center">
            <Dialog.Title className="mb-4 font-semibold text-lg">
              確認
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-gray-700">
              未保存の変更があります。破棄して閉じますか？
            </Dialog.Description>
            <Flex justify="center" gap="4">
              <Button
                onClick={handleConfirmDiscard}
                color="red"
                variant="solid"
                size="2"
              >
                はい
              </Button>
              <Button
                onClick={handleCancelDiscard}
                color="gray"
                variant="soft"
                size="2"
              >
                いいえ
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}
