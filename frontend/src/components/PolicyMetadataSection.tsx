import type { Policy } from "../types/policy";

interface PolicyMetadataSectionProps {
  policy: Policy;
}

export function PolicyMetadataSection({ policy }: PolicyMetadataSectionProps) {
  // ステータスに応じたスタイルを返すヘルパー関数
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-100 text-green-800";
      case "進行中":
        return "bg-blue-100 text-blue-800";
      case "中止":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <p className="mb-4 text-gray-600 text-md">年度: {policy.year}</p>

      {/* ステータス表示 */}
      {policy.status && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-gray-800 text-lg">
            ステータス
          </h3>
          <span
            className={`rounded-full px-3 py-1 font-bold text-md ${getStatusClasses(policy.status)}`}
          >
            {policy.status}
          </span>
        </div>
      )}

      {/* 予算表示 */}
      {policy.budget !== undefined && policy.budget !== null && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-gray-800 text-lg">予算</h3>
          <p className="font-bold text-gray-700 text-lg">
            {policy.budget.toLocaleString()} 円
          </p>
        </div>
      )}

      {/* 人気度表示 */}
      {(() => {
        const totalVotes = (policy.upvotes || 0) + (policy.downvotes || 0);
        const popularity =
          totalVotes > 0 ? ((policy.upvotes || 0) / totalVotes) * 100 : 0;
        return (
          <div className="mb-4">
            <h3 className="mb-2 font-semibold text-gray-800 text-lg">人気度</h3>
            {popularity !== null ? (
              <span
                className={`font-bold text-md ${
                  popularity >= 70
                    ? "text-green-600"
                    : popularity >= 40
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {popularity.toFixed(0)}%
              </span>
            ) : (
              <span className="font-semibold text-gray-500 text-md">
                評価なし
              </span>
            )}
            <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
              <div
                className={`h-2.5 rounded-full ${
                  popularity >= 70
                    ? "bg-green-500"
                    : popularity >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${popularity || 0}%` }}
              />
            </div>
          </div>
        );
      })()}

      <div className="mb-4">
        <h3 className="mb-2 font-semibold text-gray-800 text-lg">目的</h3>
        <p className="text-gray-700">{policy.purpose}</p>
      </div>

      {/* 解決したい問題点 */}
      {policy.problems && policy.problems.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-gray-800 text-lg">
            解決したい問題点
          </h3>
          <ul className="list-inside list-disc text-gray-700">
            {policy.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h3 className="mb-2 font-semibold text-gray-800 text-lg">概要</h3>
        <p className="text-gray-700">{policy.overview}</p>
      </div>

      {/* 具体的計画の内容 */}
      {policy.detailedPlan && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-gray-800 text-lg">
            具体的計画の内容
          </h3>
          <p className="text-gray-700">{policy.detailedPlan}</p>
        </div>
      )}
    </>
  );
}

// メリット以降の部分を別コンポーネントとして作成
export function PolicyBenefitsSection({ policy }: PolicyMetadataSectionProps) {
  return (
    <>
      {/* メリット */}
      {policy.benefits && policy.benefits.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-green-700 text-lg">
            メリット
          </h3>
          <ul className="list-inside list-disc text-gray-700">
            {policy.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* デメリット */}
      {policy.drawbacks && policy.drawbacks.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-lg text-red-700">
            デメリット
          </h3>
          <ul className="list-inside list-disc text-gray-700">
            {policy.drawbacks.map((drawback) => (
              <li key={drawback}>{drawback}</li>
            ))}
          </ul>
        </div>
      )}

      {/* キーワード */}
      {policy.keywords && policy.keywords.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 font-semibold text-gray-800 text-lg">
            関連キーワード
          </h3>
          <div className="flex flex-wrap gap-2">
            {policy.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 関連イベント */}
      {policy.relatedEvents && policy.relatedEvents.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 font-semibold text-gray-800 text-lg">
            政策に関するイベント
          </h3>
          <div className="relative border-blue-300 border-l-2 pl-6">
            {policy.relatedEvents.map((event) => (
              <div key={event} className="mb-4 last:mb-0">
                <div className="-left-2 absolute top-0 mt-1 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                <p className="text-gray-700">{event}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
