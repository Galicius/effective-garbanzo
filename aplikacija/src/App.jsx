import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import EmployeeEntryForm from "./components/EmployeeEntryForm";
import EditEntryForm from "./components/EditEntryForm";
import LoginForm from "./components/LoginForm";
import EmployeeHoursTable from "./components/EmployeeHoursTable";
import Overview from "./components/Overview";

const App = () => {
  const [currentView, setCurrentView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null); 

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === "mojaEvidenca" && isAuthenticated) {
      setEmployeeId(1); //TODO make it dynamic
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView("vnesiUre");
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setCurrentView("editEntry");
  };

  return (
    <Router>
      <div >
        {currentView !== "login" && <Header onNavigate={handleNavigate} />}
        {currentView === "login" && <LoginForm onLogin={handleLogin} />}
        {currentView === "vnesiUre" && <EmployeeEntryForm />}
        {currentView === "mojaEvidenca" && (
          <EmployeeHoursTable employeeId={employeeId} onEdit={handleEdit} />
        )}
        {currentView === "pregled" && (
          <Overview employeeId={employeeId} onEdit={handleEdit} />
        )}
        {currentView === "editEntry" && selectedEntry && (
          <EditEntryForm entryId={selectedEntry.id} />
        )}
      </div>
    </Router>
  );
};

export default App;
