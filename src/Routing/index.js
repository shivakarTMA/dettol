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
import ReportsScreen from "../Pages/Admin/ReportsScreen";
import TaskListScreen from "../Pages/Admin/TaskListScreen";
import SchoolsScreen from "../Pages/Admin/SchoolsScreen";
import StudentsScreen from "../Pages/Admin/StudentsScreen";
import CategoryListScreen from "../Pages/Admin/CategoryListScreen";
import RewardsListScreen from "../Pages/Admin/RewardsListScreen";
import AdminDashboard from "../Pages/Admin/Home";
import CoordinatorDashboard from "../Pages/Coordinator/Home";

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

        {userType === "admin" && (
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
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/task-list"
              element={
                <PrivateRoute>
                  <TaskListScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/school-list"
              element={
                <PrivateRoute>
                  <SchoolsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-list"
              element={
                <PrivateRoute>
                  <StudentsScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/category-list"
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
          </>
        )}

        {userType === "coordinator" && (
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CoordinatorDashboard />
              </PrivateRoute>
            }
          />
        )}

        {/* CoordinatorDashboard */}
      </Routes>
    </Router>
  );
}
