import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'lmsOnCloudApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'course',
    data: { pageTitle: 'lmsOnCloudApp.course.home.title' },
    loadChildren: () => import('./course/course.routes'),
  },
  {
    path: 'module',
    data: { pageTitle: 'lmsOnCloudApp.module.home.title' },
    loadChildren: () => import('./module/module.routes'),
  },
  {
    path: 'lesson',
    data: { pageTitle: 'lmsOnCloudApp.lesson.home.title' },
    loadChildren: () => import('./lesson/lesson.routes'),
  },
  {
    path: 'app-user',
    data: { pageTitle: 'lmsOnCloudApp.appUser.home.title' },
    loadChildren: () => import('./app-user/app-user.routes'),
  },
  {
    path: 'enrollment',
    data: { pageTitle: 'lmsOnCloudApp.enrollment.home.title' },
    loadChildren: () => import('./enrollment/enrollment.routes'),
  },
  {
    path: 'content-library',
    data: { pageTitle: 'lmsOnCloudApp.contentLibrary.home.title' },
    loadChildren: () => import('./content-library/content-library.routes'),
  },
  {
    path: 'project',
    data: { pageTitle: 'lmsOnCloudApp.project.home.title' },
    loadChildren: () => import('./project/project.routes'),
  },
  {
    path: 'message',
    data: { pageTitle: 'lmsOnCloudApp.message.home.title' },
    loadChildren: () => import('./message/message.routes'),
  },
  {
    path: 'discussion',
    data: { pageTitle: 'lmsOnCloudApp.discussion.home.title' },
    loadChildren: () => import('./discussion/discussion.routes'),
  },
  {
    path: 'announcement',
    data: { pageTitle: 'lmsOnCloudApp.announcement.home.title' },
    loadChildren: () => import('./announcement/announcement.routes'),
  },
  {
    path: 'quiz',
    data: { pageTitle: 'lmsOnCloudApp.quiz.home.title' },
    loadChildren: () => import('./quiz/quiz.routes'),
  },
  {
    path: 'assignment',
    data: { pageTitle: 'lmsOnCloudApp.assignment.home.title' },
    loadChildren: () => import('./assignment/assignment.routes'),
  },
  {
    path: 'gradebook',
    data: { pageTitle: 'lmsOnCloudApp.gradebook.home.title' },
    loadChildren: () => import('./gradebook/gradebook.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
