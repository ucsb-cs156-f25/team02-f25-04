import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

export default {
  title: "pages/UCSBOrganization/UCSBOrganizationEditPage",
  component: UCSBOrganizationEditPage,
};

const Template = () => <UCSBOrganizationEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    // Mock current user
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),

    // Mock system info
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),

    // Mock GET request for existing org
    http.get("/api/ucsborganization", () => {
      return HttpResponse.json(ucsbOrganizationFixtures.oneOrganization, {
        status: 200,
      });
    }),

    // Mock PUT request for update
    http.put("/api/ucsborganization", (req) => {
      window.alert(
        "PUT: " + req.url + " and body: " + JSON.stringify(req.body, null, 2),
      );
      return HttpResponse.json({
      }, { status: 200 });
    }),
  ],
};
