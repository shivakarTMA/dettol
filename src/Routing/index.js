import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import PrivateRoute from "./PrivateRoute";
import Login from "../Components/Common/Login";
import TaskListScreen from "../Pages/Admin/TaskListScreen";
import SchoolsScreen from "../Pages/Admin/SchoolsScreen";
import StudentsScreen from "../Pages/Admin/StudentsScreen";
import CategoryListScreen from "../Pages/Admin/CategoryListScreen";
import RewardsListScreen from "../Pages/Admin/RewardsListScreen";
import AdminDashboard from "../Pages/Admin/Home";
import CoordinatorDashboard from "../Pages/Coordinator/Home";
import SpinAwardsScreen from "../Pages/Admin/SpinAwardsScreen";
import LearnModuleListScreen from "../Pages/Admin/LearnModuleListScreen";
import TelemedicineListScreen from "../Pages/Admin/TelemedicineListScreen";
import EmployeeFeedbackListScreen from "../Pages/Admin/EmployeeFeedbackListScreen";
import StudentFeedbackListScreen from "../Pages/Admin/StudentFeedbackListScreen";
import SchoolWiseMilestonesListScreen from "../Pages/Admin/SchoolWiseMilestonesListScreen";
import SchoolWiseActiveStudentScreen from "../Pages/Admin/SchoolWiseActiveStudentScreen";
import SchoolwiseFeedbackListScreen from "../Pages/Admin/SchoolwiseFeedbackListScreen";
import MilestonesCompletionScreen from "../Pages/Coordinator/MilestonesCompletionScreen";
import CordinatorPerformanceListScreen from "../Pages/Admin/CordinatorPerformanceListScreen";
import UserManagementScreen from "../Pages/Admin/UserManagementScreen";
import TicketsScreen from "../Pages/Admin/TicketsScreen";
import TicketsCodinatorScreen from "../Pages/Coordinator/TicketsCodinatorScreen";
import InventoryListScreen from "../Pages/Admin/InventoryListScreen";
import SchoolMappingListScreen from "../Pages/Admin/SchoolMappingListScreen";
import FaqListScreen from "../Pages/Admin/FaqListScreen";
import FaqCategoryListScreen from "../Pages/Admin/FaqCategoryListScreen";

export default function Routing() {
  const { accessToken, userType } = useSelector((state) => state.auth);

  if (!accessToken) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Common Login Route */}
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/" />} />

        {userType === "ADMIN" && (
          <>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TaskListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <PrivateRoute>
                  <UserManagementScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <PrivateRoute>
                  <TicketsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/school-management"
              element={
                <PrivateRoute>
                  <SchoolsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-management"
              element={
                <PrivateRoute>
                  <StudentsScreen />
                </PrivateRoute>
              }
            />
             <Route
              path="/milestones-completion"
              element={
                <PrivateRoute>
                  <MilestonesCompletionScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/task-category"
              element={
                <PrivateRoute>
                  <CategoryListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/rewards-list"
              element={
                <PrivateRoute>
                  <RewardsListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/spin-rewards"
              element={
                <PrivateRoute>
                  <SpinAwardsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/learn-module"
              element={
                <PrivateRoute>
                  <LearnModuleListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee-feedback"
              element={
                <PrivateRoute>
                  <EmployeeFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-feedback"
              element={
                <PrivateRoute>
                  <StudentFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/schoolwise-feedback"
              element={
                <PrivateRoute>
                  <SchoolwiseFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/cordinator-performance"
              element={
                <PrivateRoute>
                  <CordinatorPerformanceListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <InventoryListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/school-mapping"
              element={
                <PrivateRoute>
                  <SchoolMappingListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/faq-management"
              element={
                <PrivateRoute>
                  <FaqListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/faq-category"
              element={
                <PrivateRoute>
                  <FaqCategoryListScreen />
                </PrivateRoute>
              }
            />
          </>
        )}

        {userType === "COORDINATOR" && (
          <>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <CoordinatorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/milestones-completion"
              element={
                <PrivateRoute>
                  <MilestonesCompletionScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets-list"
              element={
                <PrivateRoute>
                  <TicketsCodinatorScreen />
                </PrivateRoute>
              }
            />
          </>
        )}
        {/* CoordinatorDashboard */}

        {(userType === "ADMIN" || userType === "PROJECT_MANAGER") && (
          <Route
            path="/telemedicine"
            element={
              <PrivateRoute>
                <TelemedicineListScreen />
              </PrivateRoute>
            }
          />
        )}

        {userType === "LEADERSHIP" && (
          <>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee-feedback"
              element={
                <PrivateRoute>
                  <EmployeeFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-feedback"
              element={
                <PrivateRoute>
                  <StudentFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/schoolwise-feedback"
              element={
                <PrivateRoute>
                  <SchoolwiseFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/cordinator-performance"
              element={
                <PrivateRoute>
                  <CordinatorPerformanceListScreen />
                </PrivateRoute>
              }
            />
          </>
        )}

        {userType === "TELEMEDICINE" && (
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TelemedicineListScreen />
              </PrivateRoute>
            }
          />
        )}

        {userType === "PROJECT_MANAGER" && (
          <>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TaskListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/school-management"
              element={
                <PrivateRoute>
                  <SchoolsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-management"
              element={
                <PrivateRoute>
                  <StudentsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/task-category"
              element={
                <PrivateRoute>
                  <CategoryListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/rewards-list"
              element={
                <PrivateRoute>
                  <RewardsListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/spin-rewards"
              element={
                <PrivateRoute>
                  <SpinAwardsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/learn-module"
              element={
                <PrivateRoute>
                  <LearnModuleListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee-feedback"
              element={
                <PrivateRoute>
                  <EmployeeFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-feedback"
              element={
                <PrivateRoute>
                  <StudentFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/schoolwise-feedback"
              element={
                <PrivateRoute>
                  <SchoolwiseFeedbackListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/cordinator-performance"
              element={
                <PrivateRoute>
                  <CordinatorPerformanceListScreen />
                </PrivateRoute>
              }
            />
          </>
        )}

        <Route
          path="/milestones-achieved"
          element={
            <PrivateRoute>
              <SchoolWiseMilestonesListScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/active-students"
          element={
            <PrivateRoute>
              <SchoolWiseActiveStudentScreen />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
