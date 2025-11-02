import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function MenuItemReviewForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  const id_regex = /^\d+$/;
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navigate = useNavigate();

  const testIdPrefix = "MenuItemReviewForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="item_id">Item Id</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-item_id"}
          id="item_id"
          type="text"
          isInvalid={Boolean(errors.item_id)}
          {...register("item_id", {
            required: "Item Id is required.",
            maxLength: {
              value: id_regex,
              message: "Item Id must correspond to a valid menu item.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.item_id?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="reviewer_email">Reviewer Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-reviewer_email"}
          id="reviewer_email"
          type="text"
          placeholder="e.g. cgaucho@ucsb.edu"
          isInvalid={Boolean(errors.reviewer_email)}
          {...register("reviewer_email", {
            required: "Reviewer Email is required.",
            maxLength: {
              value: email_regex,
              message: "Reviewer email must be a valid email address.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.reviewer_email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="stars">Stars</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-stars"}
          id="stars"
          type="stars"
          placeholder="e.g. 1"
          isInvalid={Boolean(errors.stars)}
          {...register("stars", {
            required: "Stars are required.",
            maxLength: {
              value: 1,
              message: "Must be a valid number from 1-5 stars.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.stars?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="comments">Comments</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-comments"}
          id="comments"
          type="text"
          isInvalid={Boolean(errors.comments)}
          {...register("comments", {
            required: "Comments is required.",
            maxLength: {
              value: 255,
              message: "Must be within 255 character.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.comments?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
            <Form.Label htmlFor="dateReviewed">Date (iso format)</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-dateReviewed"}
              id="dateReviewed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateReviewed)}
              {...register("dateReviewed", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateReviewed && "Date Reviewed is required. "}
            </Form.Control.Feedback>
        </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default MenuItemReviewForm;
