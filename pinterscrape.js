var pinterscape = {
  proxy(url) {
    return encodeURI(`https://creprox.vercel.app/${url.replace(/https\:\//, "https:")}`)
  },
  async get(id, ret) {
    if(ret == 2) throw Error("Failed to scrape")
    const request = await fetch(this.proxy(`https://pinterest.com/pin/${id}`))
    let raw = await request.text()
    if(!raw.includes("https://i.pinimg.com/originals")) throw Error("Pin not found")
    try {
      const image = "https://i.pinimg.com/originals/" + raw.match(/\"url\"\:\"https\:\/\/i\.pinimg\.com\/originals\/(.*?)\"/i)[1]
      const author = raw.match(/\"originpinner\"\:\{.*\"username\"\:\"(.*)\".*\}/i)[1].split("\",")[0]
      const caption = raw.match(/\"closeupunifieddescription\"\:\"(.*)\"/i)[1].split("\",")[0].trim()
      const pin = raw.match(/\"pinid\"\:\"(.*?)\"/i)[1]
      return {
        image, author, pin,
        caption: caption.length == 0 ? null : caption
      }
    } catch(e) {
      this.get(id, (ret || 0) + 1)
    }
  },
  async search(term) {
    const request = await fetch(this.proxy(`https://pinterest.com/search/pins?q=${term}`))
    let raw = await request.text()
    const match = [...raw.matchAll(/href\=\"\/pin\/([0-9]*?)\/\"/gi)]
    return match.map(x => x[1])
  }
}