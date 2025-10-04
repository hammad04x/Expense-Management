import { pool } from "../config/db.js"

export async function getRulesForCompany(companyId) {
  const [rows] = await pool.query("SELECT * FROM approval_rules WHERE company_id=? ORDER BY level ASC", [companyId])
  return rows
}
