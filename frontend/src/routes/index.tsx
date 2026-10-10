import { createBrowserRouter, Navigate } from "react-router-dom"
import AuthLayout from "@Components/common/AuthLayout"
import RequireAuth from "@Components/common/RequireAuth"
import Login from "@/pages/Login/Login"
import Dashboard from "@/pages/Dashboard"
import Templates from "@/pages/Templates/Templates"
import NewTemplate from "@/pages/Templates/NewTemplate"
import EditTemplate from "@/pages/Templates/EditTemplate"
import Documents from "@/pages/Document/Documents"
import DocFlowList from "@/pages/DocFlow/DocFlowList"
import CreateDocFlow from "@/pages/DocFlow/create"
import UpdateDocFlow from "@/pages/DocFlow/update"
import ChangePassword from "@/pages/ChangePassword/password"
import ActivityLog from "@/pages/ActivityLog/log"
import Signup from "@/pages/Signup/Signup"

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "templates", element: <Templates /> },
          { path: "templates/new", element: <NewTemplate /> },
          { path: "templates/:id/edit", element: <EditTemplate /> },
          { path: "documents", element: <Documents /> },
          { path: "DocFlow", element: <DocFlowList /> },
          { path: "DocFlow/create", element: <CreateDocFlow /> },
          { path: "DocFlow/update/:id", element: <UpdateDocFlow /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "activity-log", element: < ActivityLog /> },
        ],
      },
    ],
  },
])