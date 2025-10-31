const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 29,
    reviewerEmail: "carumugam@ucsb.edu",
    stars: 1,
    dateReviewed: "2025-10-26T12:00:00",
    comments: "very bad",
  },
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 30,
      reviewerEmail: "rhung@ucsb.edu",
      stars: 5,
      dateReviewed: "2025-10-27T12:00:00",
      comments: "very delicious",
    },
    {
      id: 2,
      itemId: 31,
      reviewerEmail: "tester@ucsb.edu",
      stars: 3,
      dateReviewed: "2025-10-28T12:00:00",
      comments: "very mid",
    },
    {
      id: 3,
      itemId: 32,
      reviewerEmail: "tester2@ucsb.edu",
      stars: 4,
      dateReviewed: "2025-10-29T12:00:00",
      comments: "decent",
    },
  ],
};

export { menuItemReviewFixtures };
