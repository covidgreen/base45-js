const { ok, deepStrictEqual, strictEqual } = require("assert");
const b45 = require("../lib/base45-js.js");

//TODO replace with assert.throws if possible
function assertThrowsWithMessage(f, expectedMessage) {
    try {
        f();
        return false;
    }
    catch (e) {
        strictEqual(e.message, expectedMessage);
        return true;
    }
}

describe("RFC examples", () => {

    it("encode null.", () => ok(assertThrowsWithMessage(()=>b45.encode(null), "byteArrayArg is null or undefined.")));
    it("encode undefined.", () => ok(assertThrowsWithMessage(() => b45.encode(undefined), "byteArrayArg is null or undefined.")));

    it("encode array -empty-", () => strictEqual(b45.encode([]), ""));
    it("encode array {0}", () => strictEqual(b45.encode([0]), "00"));
    it("encode array {0,0}", () => strictEqual(b45.encode([0, 0]), "000"));
    it("encode array {lots}", () => strictEqual(b45.encode([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), "000000000000000000"));

    it("encode example 1 - Hello!!", () => strictEqual(b45.encode(Buffer.from("Hello!!", "utf-8")), "%69 VD92EX0"));
    it("encode example 2 - base-45", () => strictEqual(b45.encode(Buffer.from("base-45", "utf-8")), "UJCLQE7W581"));
    it("encode example 3 - ietf!", () => strictEqual(b45.encode(Buffer.from("ietf!", "utf-8")), "QED8WEX0"));

    it("decode null.", () => ok(assertThrowsWithMessage(() => b45.decode(null), "utf8StringArg is null or undefined.")));
    it("decode undefined.", () => ok(assertThrowsWithMessage(() => b45.decode(undefined), "utf8StringArg is null or undefined.")));
    it("decode - bad length 1", () => ok(assertThrowsWithMessage(() => b45.decode("1"), "utf8StringArg has incorrect length.")));
    it("decode - bad length 4", () => ok(assertThrowsWithMessage(() => b45.decode("1234"), "utf8StringArg has incorrect length.")));
    it("decode - invalid characters 0", () => ok(assertThrowsWithMessage(() => b45.decode("^1"), "Invalid character at position 0.")));
    it("decode - invalid characters 1", () => ok(assertThrowsWithMessage(() => b45.decode("0^"), "Invalid character at position 1.")));
    it("decode - invalid characters 10", () => ok(assertThrowsWithMessage(() => b45.decode("0123456789^"), "Invalid character at position 10.")));

    it("decode -empty-", () => deepStrictEqual(b45.decode(""), []));
    it("decode 00", () => deepStrictEqual(b45.decode("00"), [0]));
    it("decode 000", () => deepStrictEqual(b45.decode("000"), [0, 0]));

    it("decode example 1 - %69 VD92EX0 -> Hello!!", () => deepStrictEqual(b45.decode("%69 VD92EX0"), [72, 101, 108, 108, 111, 33, 33]));
    it("decode example 2 - UJCLQE7W581 -> base-45", () => deepStrictEqual(b45.decode("UJCLQE7W581"), [98, 97, 115, 101, 45, 52, 53]));
    it("decode example 3 - QED8WEX0 ->ietf!", () => deepStrictEqual(b45.decode("QED8WEX0"), [105, 101, 116, 102, 33]));

    it("decode convenience - UJCLQE7W581 -> base-45", () => strictEqual(b45.decodeToUtf8String("UJCLQE7W581"), "base-45"));

});
