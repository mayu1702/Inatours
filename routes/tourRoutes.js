const express = require('express');
const tourController = require("../controller/tourController");

const tourRouter = express.Router();

//tourRouter.param('id',tourController.checkID);

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours);

tourRouter.route('/tour-stats').get(tourController.getStatTour);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.postNewTour);

 
tourRouter
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports =  tourRouter;
