# parcelLab webhook to CSV file

> Receives parcelLab webhooks and writes them to a CSV

Get help at [support@parcellab.com](mailto:support@parcellab.com)

# What it does

It receives parcelLab webhooks (or actually any webhook) and transforms any received JSON payload to CSV files. It writes a new file approx every 30 seconds. The generated CSV will have headings in the order of the keys of the received payloads.

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
