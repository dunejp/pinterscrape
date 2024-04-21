> [!NOTE]
> Live preview page will be implemented soon.
>
> *Stamped at April 21, 2023*

# Pinterscrape
:pushpin: Pinterscrape is a simple and lightweight web scraper for pinterest.

> [!IMPORTANT]
> Pinterscrape currently only supports image scraping. Attempting to scrape videos or stories will result in an error.

```javascript
// https://pinterest.com/pin/<PIN-ID>
const pin = await pinterscrape.get("682084306094066099")
```

```javascript
{
  author: "digitalsynopsis",
  caption: "#design #GraphicDesign #LogoDesign #WebDesign #clients #fonts #Photoshop #advertising #AgencyLife #artist #designer #developer #GraphicDesigner #LogoDesigner #WebDesigner #memes #agency #ArtDirector #CreativeDirector #AdAgency",
  image: "https://i.pinimg.com/originals/4f/90/19/4f9019df1b5bddb1a6c973ccbfb16693.jpg",
  pin: "682084306094066099"
}
```

## Documentation

### Scraping an image

Simply call the method `get` with the pin ID as a string.

```javascript
await pinterscrape.get(PIN_ID)
```

> [!WARNING]
> The argument `PIN_ID` must be a string. I encountered an incorrect lookup during scraping, not due to the process itself, but rather because the pin ID was assigned as a number.

This method will return an object. If it does not, it will attempt to scrape it again as a fallback.

```javascript
{
  author: String, // the username of the author
  caption: String, // the description written on the pin, null if no caption
  image: String, // the URL of the original pin image
  pin: String // the pin ID; use this to verify if the scraping is correct
}
```

## Searching for pins

Simply call the method `search` with the query as a string.

```javascript
await pinterscrape.search(QUERY)
```

> [!NOTE]
> Pinterest does not accept limitations or pagination for searching during scraping. Therefore, you cannot control the number of pins generated or paginate through them.

This method will return an array of pin IDs.

## Using a proxy

Most web scrapers use rotating proxies. The default proxy used is [creprox](https://github.com/creuserr/creprox).

To use your own proxy, modify the method `pinterscrape.proxy`.

```javascript
pinterscrape.proxy = url => {
  return "https://your-proxy.net/?url=" + url
}
```

## Error
When `pinterscrape.get` failed to scrape, it will throw an error (at the last attempt) and return the error information (at the first attempt).

```javascript
{
  error: Error,
  cause: String
}
```

If there's an error related to regular expression, `cause` could be either image, author, caption, or pin, depending on the part that triggers the error.

***

> [!WARNING]
> Pinterscrape's usual latency is between 2-6 seconds due to pinterest's source code.
