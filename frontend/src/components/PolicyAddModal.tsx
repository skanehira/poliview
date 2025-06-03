import { Button, Dialog } from "@radix-ui/themes";
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
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-700">
              新しい政策を追加
            </Dialog.Title>
            <Dialog.Close>
              <Button variant="ghost" color="gray" size="1">
                &times;
              </Button>
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                政策タイトル
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPolicyData.title}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                年度
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={newPolicyData.year}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                政策の目的
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={newPolicyData.purpose}
                onChange={handleFormChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="overview"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                政策の概要
              </label>
              <textarea
                id="overview"
                name="overview"
                value={newPolicyData.overview}
                onChange={handleFormChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="detailedPlan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                具体的計画の内容
              </label>
              <textarea
                id="detailedPlan"
                name="detailedPlan"
                value={newPolicyData.detailedPlan}
                onChange={handleFormChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="problems"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                解決したい問題点 (カンマ区切り)
              </label>
              <input
                type="text"
                id="problems"
                name="problems"
                value={newPolicyData.problems}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="benefits"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                メリット (カンマ区切り)
              </label>
              <input
                type="text"
                id="benefits"
                name="benefits"
                value={newPolicyData.benefits}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="drawbacks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                デメリット (カンマ区切り)
              </label>
              <input
                type="text"
                id="drawbacks"
                name="drawbacks"
                value={newPolicyData.drawbacks}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                キーワード (カンマ区切り)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={newPolicyData.keywords}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="relatedEvents"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                政策に関するイベント (カンマ区切り)
              </label>
              <input
                type="text"
                id="relatedEvents"
                name="relatedEvents"
                value={newPolicyData.relatedEvents}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                予算 (円)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={newPolicyData.budget}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ステータス
              </label>
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
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" variant="solid" color="blue" size="3">
                政策を保存
              </Button>
            </div>
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
            <div className="flex justify-center space-x-4">
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
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}
