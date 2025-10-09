export default async function handler(req, res) {
  const repo = "ruwed11-byte/RTP";
  const filename = "data.json";
  const token = process.env.GITHUB_TOKEN;

  try {
    // Ambil isi data.json dari GitHub
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      headers: { Authorization: `token ${token}` }
    });
    const file = await response.json();

    // Decode isi lama, parse ke JSON
    const content = Buffer.from(file.content, "base64").toString("utf-8");
    const data = JSON.parse(content);

    // Ubah nilai rtp ke angka acak baru
    const updatedData = data.map(item => ({
      ...item,
      rtp: parseFloat((Math.random() * 100).toFixed(1))
    }));

    // Encode lagi ke base64 untuk diunggah
    const newContent = Buffer.from(JSON.stringify(updatedData, null, 2)).toString("base64");

    // Commit file baru ke GitHub
    await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Auto reset RTP ${new Date().toLocaleString("id-ID")}`,
        content: newContent,
        sha: file.sha
      })
    });

    res.status(200).json({ success: true, message: "Data.json berhasil direset!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
