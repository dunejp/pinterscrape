var pinterscrape = {
  proxy(url) {
    return encodeURI(`https://creprox.vercel.app/${url.replace(/http(s?)\:\/\//, "")}`)
  },
  async get(id, ret) {
    if(ret == 2) throw Error("Failed to scrape")
    const request = await fetch(this.proxy(`https://pinterest.com/pin/${id}`))
    let raw = await request.text()
    if(!raw.includes("https://i.pinimg.com/originals")) throw Error("Pin not found")
    let x = 0
    try {
      const image = "https://i.pinimg.com/originals/" + raw.match(/\"url\"\:\"https\:\/\/i\.pinimg\.com\/originals\/(.*?)\"/i)[1]
      x++
      const author = raw.match(/\"username\"\:\"(.*?)\".*\}/i)[1]
      x++
      const caption = raw.match(/\"closeupunifieddescription\"\:\"(.*)\"/i)[1].split("\",")[0].trim()
      x++
      const pin = raw.match(/\"pinid\"\:\"(.*?)\"/i)[1]
      return {
        image, author, pin,
        caption: caption.length == 0 ? null : caption
      }
    } catch(e) {
      this.get(id, (ret || 0) + 1)
      return {
        error: e,
        cause: ["image", "author", "caption", "pin"][x]
      }
    }
  },
  async search(term) {
    const request = await fetch(this.proxy(`https://pinterest.com/search/pins?q=${encodeURIComponent(term)}`))
    let raw = await request.text()
    const match = [...raw.matchAll(/href\=\"\/pin\/([0-9]*?)\/\"/gi)]
    return match.map(x => x[1])
  }
}