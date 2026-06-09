import Layout from "./Layout"
import { Link } from 'react-router-dom'

function By_category(){
  return(
    <Layout>
      <div>
        <h1>Categories</h1>
        <Link to="/summary" style={{ 
  display: "block",
  padding: "12px 24px",
  margin: "8px 0",
  backgroundColor: "#2e404eff",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  width: "200px",
  textAlign: "center"
}}>Summary</Link>
        <Link to="/summary_script" style={{ 
  display: "block",
  padding: "12px 24px",
  margin: "8px 0",
  backgroundColor: "#2e404eff",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  width: "200px",
  textAlign: "center"
}}>Summary script</Link>
        <Link to="/summary_scipt_year" style={{ 
  display: "block",
  padding: "12px 24px",
  margin: "8px 0",
  backgroundColor: "#2e404eff",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  width: "200px",
  textAlign: "center"
}}>Summary script year</Link>
        <Link to="/summary_month" style={{ 
  display: "block",
  padding: "12px 24px",
  margin: "8px 0",
  backgroundColor: "#2e404eff",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  width: "200px",
  textAlign: "center"
}}>Summary by month</Link>
      </div>
    </Layout>
  )
}

export default By_category;