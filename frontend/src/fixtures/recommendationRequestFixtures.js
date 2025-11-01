const recommendationRequestFixtures = {
  oneRecommendationRequest: 
    {
      id: 1,
      requesterEmail: "test1@ucsb.edu",
      professorEmail: "prof1@ucsb.edu",
      explanation: "i want more mexican food",
      dateRequested: "2022-01-03T00:10:01",
      dateNeeded: "2022-01-03T00:10:01",
      done: true,
    },

  threeRecommendationRequests: [
    {
      id: 2,
      requesterEmail: "test2@ucsb.edu",
      professorEmail: "prof2@ucsb.edu",
      explanation: "i want more chinese food",
      dateRequested: "2022-01-03T00:10:02",
      dateNeeded: "2022-01-03T00:10:02",
      done: true,
    },

    {
      id: 3,
      requesterEmail: "test3@ucsb.edu",
      professorEmail: "prof3@ucsb.edu",
      explanation: "i want more african food",
      dateRequested: "2022-01-03T00:10:03",
      dateNeeded: "2022-01-03T00:10:03",
      done: true,
    },

    {
      id: 4,
      requesterEmail: "test4@ucsb.edu",
      professorEmail: "prof4@ucsb.edu",
      explanation: "i want more indian food",
      dateRequested: "2022-01-03T00:10:04",
      dateNeeded: "2022-01-03T00:10:04",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
