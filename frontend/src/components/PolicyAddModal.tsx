import {
  Button,
  Dialog,
  TextField,
  TextArea,
  Flex,
  Grid,
  Text,
} from "@radix-ui/themes";
import { useState, type FormEvent } from "react";
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
          <Flex justify="between" align="start" mb="4">
            <Dialog.Title className="text-xl font-semibold text-blue-700">
              新しい政策を追加
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                &times;
              </Button>
            </Dialog.Close>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Grid columns={{ initial: "1", md: "2" }} gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="title" size="2" weight="medium">
                  政策タイトル
                </Text>
                <TextField.Root
                  id="title"
                  name="title"
                  value={newPolicyData.title}
                  onChange={handleFormChange}
                  required
                />
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" htmlFor="year" size="2" weight="medium">
                  年度
                </Text>
                <TextField.Root
                  id="year"
                  type="number"
                  name="year"
                  value={newPolicyData.year}
                  onChange={handleFormChange}
                  required
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="purpose" size="2" weight="medium">
                  政策の目的
                </Text>
                <TextArea
                  id="purpose"
                  name="purpose"
                  value={newPolicyData.purpose}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="overview" size="2" weight="medium">
                  政策の概要
                </Text>
                <TextArea
                  id="overview"
                  name="overview"
                  value={newPolicyData.overview}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text
                  as="label"
                  htmlFor="detailedPlan"
                  size="2"
                  weight="medium"
                >
                  具体的計画の内容
                </Text>
                <TextArea
                  id="detailedPlan"
                  name="detailedPlan"
                  value={newPolicyData.detailedPlan}
                  onChange={handleFormChange}
                  rows={3}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="problems" size="2" weight="medium">
                  解決したい問題点 (カンマ区切り)
                </Text>
                <TextField.Root
                  id="problems"
                  name="problems"
                  value={newPolicyData.problems}
                  onChange={handleFormChange}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="benefits" size="2" weight="medium">
                  メリット (カンマ区切り)
                </Text>
                <TextField.Root
                  id="benefits"
                  name="benefits"
                  value={newPolicyData.benefits}
                  onChange={handleFormChange}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="drawbacks" size="2" weight="medium">
                  デメリット (カンマ区切り)
                </Text>
                <TextField.Root
                  id="drawbacks"
                  name="drawbacks"
                  value={newPolicyData.drawbacks}
                  onChange={handleFormChange}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="keywords" size="2" weight="medium">
                  キーワード (カンマ区切り)
                </Text>
                <TextField.Root
                  id="keywords"
                  name="keywords"
                  value={newPolicyData.keywords}
                  onChange={handleFormChange}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text
                  as="label"
                  htmlFor="relatedEvents"
                  size="2"
                  weight="medium"
                >
                  政策に関するイベント (カンマ区切り)
                </Text>
                <TextField.Root
                  id="relatedEvents"
                  name="relatedEvents"
                  value={newPolicyData.relatedEvents}
                  onChange={handleFormChange}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="budget" size="2" weight="medium">
                  予算 (円)
                </Text>
                <TextField.Root
                  id="budget"
                  type="number"
                  name="budget"
                  value={newPolicyData.budget}
                  onChange={handleFormChange}
                />
              </Flex>
              <Flex direction="column" gap="1" style={{ gridColumn: "1 / -1" }}>
                <Text as="label" htmlFor="status" size="2" weight="medium">
                  ステータス
                </Text>
                <select
                  id="status"
                  name="status"
                  value={newPolicyData.status}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="進行中">進行中</option>
                  <option value="完了">完了</option>
                  <option value="中止">中止</option>
                </select>
              </Flex>
              <Flex justify="end" style={{ gridColumn: "1 / -1" }}>
                <Button type="submit" variant="solid" color="blue" size="3">
                  政策を保存
                </Button>
              </Flex>
            </Grid>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Confirmation dialog for unsaved changes */}
      {showConfirmClose && (
        <Dialog.Root
          open={showConfirmClose}
          onOpenChange={(open) => !open && handleCancelDiscard()}
        >
          <Dialog.Content maxWidth="24rem" className="text-center">
            <Dialog.Title className="text-lg font-semibold mb-4">
              確認
            </Dialog.Title>
            <Dialog.Description className="text-gray-700 mb-6">
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
