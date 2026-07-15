# MISE "OsservaPrezzi Carburanti" public API

## endpoints

## GET

### `GET /registry/region`

All 20 Italian regions.

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/region'
```
```json
{"results":[{"id":"19","description":"Lombardia"}, {"id":"9","description":"Lazio"}, ...]}
```

### `GET /registry/province?regionId=<id>`

Provinces within a region. Note the param is `regionId`, not `region`.

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/province?regionId=19'
```
```json
{"results":[{"id":"MI","description":"Milano"}, {"id":"BG","description":"Bergamo"}, ...]}
```

### `GET /registry/town?province=<id>`

Towns/comuni within a province. Note the param here is `province`, not

`provinceId` (inconsistent with the endpoint above — verified both by
trial and error).

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/town?province=MI'
```
```json
{"results":[{"id":"Arese","description":"Arese"}, {"id":"Abbiategrasso","description":"Abbiategrasso"}, ...]}
```

`id` and `description` are always the same string (town name), i.e. `town`
in `/search/area` just wants the plain name.

### `GET /registry/brands`

Every fuel brand/chain, several hundred entries.

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/brands'
```
```json
{"results":[{"id":"96","description":"78"}, {"id":"92","description":"7sette"}, {"id":"193","description":"ACI"}, ...]}
```

### `GET /registry/flags`

Looks like the same brand list as above but with different (smaller,
sequential) numeric ids — this is the id space used by `flagId` in

`/registry/fueltype` below. `id: "0"` = "no brand selected".

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/flags'
```
```json
{"results":[{"id":"0","description":"Bandiera non selezionata"}, {"id":"1","description":"Agip Eni"}, {"id":"2","description":"Q8"}, ...]}
```

### `GET /registry/fuels`

Flat list of fuel-type + self/servito combos, `id` format is `<fuelId>-<x|1|0>`
(`x` = either, `1` = self-service, `0` = attended/servito).

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/fuels'
```
```json
{"results":[{"id":"1-x","description":"Benzina"}, {"id":"1-1","description":"Benzina (Self)"}, {"id":"1-0","description":"Benzina (Servito)"}, {"id":"2-x","description":"Gasolio"}, ...]}
```

In practice you don't need this to read `/search/area` results — each
returned fuel entry already carries its own `name`, `fuelId`, `isSelf`.

### `GET /registry/fueltype?flagId=<brandId>`

Fuel types a given brand offers (needs `flagId`, from `/registry/flags`
above — calling it with no `flagId` returns an empty body).

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/fueltype?flagId=1'
```
```json
{"results":[{"id":"1","description":"Benzina","self":false,"servito":false}, {"id":"2","description":"Gasolio","self":false,"servito":false}, ...]}
```

### `GET /registry/services`

Amenity list (used as filters in the UI: Wi-Fi, food, EV charging, etc).

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/services'
```
```json
{"results":[{"id":"1","description":"Food&Beverage"}, {"id":"8","description":"Wi-Fi"}, {"id":"11","description":"Colonnina ricarica elettrica"}, ...]}
```

### `GET /registry/highway`

Italian motorways/highways, including directional sub-segments.

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/highway'
```
```json
{"results":[{"id":"A1","description":"A1 - TUTTE"}, {"id":"A1-1","description":"A1 MILANO-NAPOLI"}, ...]}
```

### `GET /registry/conventions`

Motorway-concessionaire list (used in the private portal's station
registration flow, but the endpoint itself is public).

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/conventions'
```
```json
{"results":[{"id":"1","description":"Nessuna convenzione"}, {"id":"3","description":"Concessionaria Autostrade per l'Italia S.p.A."}, ...]}
```

### `GET /registry/stationtype`

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/stationtype'
```
```json
{"results":[{"id":"1","description":"Autostradale"}, {"id":"3","description":"Stradale"}]}
```

### `GET /registry/tipodelega`

Delegation types (private-portal concept — who can act on behalf of a
station operator — but again, the GET itself needs no auth).

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/tipodelega'
```
```json
{"results":[{"id":"1","description":"RESP.DATI"}, {"id":"2","description":"RESP.IMPIANTO"}]}
```

### `GET /registry/alllogos`

Every brand's logo, base64-encoded PNGs embedded directly in the JSON.
**Large response** (multiple MB) — only call this if you actually need the
images, and cache it.

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/alllogos'
```
```json
{"loghi":[{"bandieraId":1,"bandiera":"Agip Eni","logoMarkerList":[{"tipoFile":"th5","estensione":"png","content":"iVBORw0KG..."}]}, ...]}
```

### `GET /registry/servicearea/{id}`

Detail for a single highway service area by id. Tested with `id=1` and got
an all-`null` object back — either `1` isn't a real id, or there's a
required param I'm missing. You'd get real ids from `/search/highway`
results first, then look one up here.

```
curl 'https://carburanti.mise.gov.it/ospzApi/registry/servicearea/1'
```
```json
{"id":null,"name":null,"nomeImpianto":null,"address":null,"brand":null,"fuels":null,"phoneNumber":null,"email":null,"website":null,"company":null,"services":null,"orariapertura":null}
```

### `GET /registry/streets?tipoId=<id>`

Found referenced in the bundled code. Tried `tipoId=A1` and `tipo=A1`,
both returned empty — param name/shape unconfirmed.

### `GET /registry/adsname?streetId=<id>`

Found referenced in the bundled code, not tested.

---

## POST

Common response envelope:

```json
{
  "success": true,
  "center": {"lat": 45.24, "lng": 9.12},
  "results": [
    {
      "id": 30892,
      "name": "Iper Station Arese",
      "brand": "IperStation",
      "address": "Via Luraghi sn 20020 - ARESE MI",
      "location": {"lat": 45.5617, "lng": 9.0533},
      "insertDate": "2026-07-13T23:46:13+02:00",
      "distance": null,
      "fuels": [
        {"id": 119521177, "price": 1.848, "name": "Benzina", "fuelId": 1, "isSelf": true}
      ]
    }
  ]
}
```

`distance` is always `null` — the API doesn't compute it server-side, so
"nearest first" has to be sorted client-side using each station's
`location`.

### `POST /search/area`

Search by administrative area. `region` is **required** — omitting it
silently returns `success:true` with a hardcoded default center and no
results, rather than an error. `province`/`town` narrow it further and are
optional (id values come from the registry endpoints above; `town` is the
plain name string, not a code).

```
curl -X POST 'https://carburanti.mise.gov.it/ospzApi/search/area' \
  -H 'Content-Type: application/json' \
  -d '{"region": "19", "province": "MI", "town": "Milano"}'
```

### `POST /search/highway`

Search stations along a motorway. Field is `highwayId` (not `highway`),
value from `/registry/highway`.

```
curl -X POST 'https://carburanti.mise.gov.it/ospzApi/search/highway' \
  -H 'Content-Type: application/json' \
  -d '{"highwayId": "A1"}'
```

### `GET /search/servicearea?q=<text>`

Autocomplete search-area names by substring (used to populate a
typeahead). Returns a plain array of strings, not the usual envelope.

```
curl 'https://carburanti.mise.gov.it/ospzApi/search/servicearea?q=Secchia'
```
```json
["SECCHIA EST","SECCHIA OVEST","CIS NORD - PONTE SECCHIA"]
```

### `POST /search/servicearea`

Presumably searches by service-area name (the counterpart to the
autocomplete above). Every body shape I guessed (`name`, `area`,
`servicearea`, `serviceAreaName`) made the request **hang until timeout**
rather than returning an error — so either it needs a very different shape, or
it's doing something expensive server-side even on bad input. Unconfirmed;
didn't want to hammer their server trying more guesses.

### `POST /search/route`

Found in the bundled code (the "search along my driving route" feature).
Body shape, from the source:

```json
{
  "fuelType": "...",
  "priceOrder": "asc",
  "service": "...",
  "points": [{"lat": 0, "lng": 0}, ...]
}
```

`points` there is a decoded Google Directions polyline (i.e. you need a
real route from the Google Directions API first), so this wasn't
practical to test with curl. Field names are plausible but not verified.

### `POST /search/zone`

The free-draw circle/polygon search. Body shape, from the source:

```json
{"points": [{"lat": 0, "lng": 0}, ...]}
```
a drawn circle gets tessellated into a polygon of points client-side
before sending. In testing:
- A single point → `success:true` but with a hardcoded default center and
  empty results (looks like a "degenerate shape" short-circuit).
- Any multi-point polygon (rectangle, triangle, closed ring, open ring,
  both point orderings, both `{lat,lng}` and `{lng,lat}`) → `success:false`
  with the same hardcoded fallback center.

Never got real data out of it. If you want this working, capture a real
request from the site's Network tab while drawing a shape at
`https://carburanti.mise.gov.it/ospzSearch/` — that'll show the exact
shape the backend actually accepts.
