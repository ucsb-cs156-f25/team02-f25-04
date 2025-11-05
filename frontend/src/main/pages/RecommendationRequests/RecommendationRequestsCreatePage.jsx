import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestsForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestsCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/recommendationrequests/post",
    method: "POST",
    params: {
      requesterEmail: recommendationRequest.requesterEmail,
      professorEmail: recommendationRequest.professorEmail,
      explanation: recommendationRequest.explanation,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      done: recommendationRequest.done,
    },
  });

  const onSuccess = (recommendationRequest) => {
    toast(
      `New recommendationRequest Created - id: ${recommendationRequest.id} requesterEmail: ${recommendationRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/recommendationrequests/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationRequests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New recommendationRequests</h1>

        <RecommendationRequestsForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
