# parcelLab webhook to CSV file

> Receives parcelLab webhooks and writes them to a CSV

Get help at [support@parcellab.com](mailto:support@parcellab.com)

# What it does

It receives parcelLab webhooks (or actually any webhook) and transforms any received JSON payload to CSV files. It writes a new file approx every 30 seconds. The generated CSV will have headings in the order of the keys of the received payloads.

You can set different URL query parameters to change the behaviour:

* `?id=`: where to store files, defaults to `default`
* `&prefix=`: a prefix for all CSV file names
* `&headers=`: sets whether CSV has header row and can be `true` or `false`, defaults to `true`
* `&delimiter=`: delimiter to use in CSV, defaults to `;`
* `&quote=`: quote char to use for CSV, defaults to `"`
* `&token=`: the token as specified in `.env` (**required**)

# Example

Running a `POST` request against this service:

```bash
http://localhost:8080/webhook/?id=someid&prefix=webhook&headers=true&delimiter=|&token=some-token
```

With this body:

```json
{
	"test": "okay",
	"anothertest": "notokay"
}
```

Will generate a local file named `./someid/webhook_<timestamp>.csv` with these contents:

```csv
test;anothertest
okay;notokay
```

# Setup

Just `git clone` this repo, then `cd webhook-to-csv` and install dependecies with `npm i`.

You'll need a reverse proxy pointing to `localhost:8080` and probably something to keep the app alive, like [PM2](http://pm2.keymetrics.io/).
