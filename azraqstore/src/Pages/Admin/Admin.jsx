import AddItem from "./AddItem/AddItem"
import Dashboard from "./Dashboard/Dashboard"
import Drivers from "./Dashboard/Users/Drivers"
import SideBar from "./SideBar/SideBar"
import AllUsers from "./Dashboard/Users/AllUsers"


const Admin = () => {
  return (
    <div>
        
        {/* <SideBar/>
        <AddItem/> */}
       <Dashboard/>
      <Drivers/>
      <AllUsers/>
    </div>
  )
}

export default Admin
