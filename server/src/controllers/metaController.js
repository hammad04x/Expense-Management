import fetch from "node-fetch"

export async function countries(req, res) {
  try {
    const url = "https://restcountries.com/v3.1/all?fields=name,currencies"
    const r = await fetch(url)
    const data = await r.json()
    return res.json(data)
  } catch {
    return res.status(500).json({ error: "Countries fetch failed" })
  }
}

export async function rates(req, res) {
  const base = req.params.base || "USD"
  try {
    const url = `https://api.exchangerate-api.com/v4/latest/${base}`
    const r = await fetch(url)
    const data = await r.json()
    return res.json(data)
  } catch {
    return res.status(500).json({ error: "Rates fetch failed" })
  }
}
