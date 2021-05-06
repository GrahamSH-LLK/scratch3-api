const https = require("https");

const request = (o) => {
  let h = {
    Cookie: "scratchcsrftoken=a; scratchlanguage=en;",
    "X-CSRFToken": "a",
    referer: "https://scratch.mit.edu",
  };
  if (typeof o === "object" && o && o.headers) {
    for (let p in o.headers) {
      h[p] = o.headers[p];
    }
    if (o.body) {
      h["Content-Length"] = Buffer.byteLength(o.body);
    }
    if (o.sessionId) {
      h.Cookie += "scratchsessionsid=" + o.sessionId + ";";
    }
  }
  let p = new Promise((resolve) => {
    let r = https.request(
      {
        hostname: o.hostname || "scratch.mit.edu",
        port: 443,
        path: o.path,
        method: o.method || "GET",
        headers: h,
      },
      (res) => {
        let p = [];
        res.on("data", (c) => p.push(c));
        res.on("end", () => resolve([null, Buffer.concat(p).toString(), res]));
      }
    );
    r.on("error", resolve);
    if (o.body) {
      r.write(o.body);
    }
    r.end();
  });
  return p;
};

const getJSON = async (o) => {
  let [e, b, r] = await request(o);
  return JSON.parse(b);
}

module.exports = {
  request: request,
  getJSON: getJSON
}