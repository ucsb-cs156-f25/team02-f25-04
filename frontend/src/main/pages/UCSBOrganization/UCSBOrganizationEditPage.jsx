import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();

  const {
    data: organization,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsborganization?orgCode=${orgCode}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: "/api/ucsborganization",
      params: { orgCode },
    },
  );

  // Convert form data to PUT request
  const objectToAxiosPutParams = (organization) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: { orgCode: organization.orgCode },
    data: {
      orgTranslationShort: organization.orgTranslationShort,
      orgTranslation: organization.orgTranslation,
      inactive: organization.inactive,
    },
  });

  // Toast success message
  const onSuccess = (organization) => {
    toast(
      `UCSB Organization Updated - orgCode: ${organization.orgCode} orgTranslationShort: ${organization.orgTranslationShort}`,
    );
  };

  // Mutation setup
  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to test caching
    [`/api/ucsborganization?orgCode=${orgCode}`],
  );

  const { isSuccess } = mutation;

  // Handle submit
  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  // Redirect back after update (except in Storybook)
  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSB Organization</h1>
        {organization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={organization}
          />
        )}
      </div>
    </BasicLayout>
  );
}
