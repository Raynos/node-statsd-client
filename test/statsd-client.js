var test = require('tape');

var UDPServer = require('./lib/udp-server.js');
var StatsDClient = require('../lib/statsd-client.js');

var PORT = 8125;

test('can write gauge to client', function t(assert) {
    var server = UDPServer({ port: PORT }, function onBound() {
        var client = new StatsDClient({
            host: 'localhost',
            port: PORT,
            packetQueue: { flush: 10 }
        });

        client.gauge('foo', 'bar');
        server.once('message', function (msg) {
            assert.equal(msg.toString(), 'foo:bar|g');

            server.close();
            client.close();
            assert.end();
        });
    });
});

test('can write timing to client', function t(assert) {
    var server = UDPServer({ port: PORT }, function onBound() {
        var client = new StatsDClient({
            host: 'localhost',
            port: PORT,
            packetQueue: { flush: 10 }
        });

        client.counter('foo', 1);
        server.once('message', function (msg) {
            assert.equal(msg.toString(), 'foo:1|c\n');

            server.close();
            client.close();
            assert.end();
        });
    });
});

test('can write counter to client', function t(assert) {
    var server = UDPServer({ port: PORT }, function onBound() {
        var client = new StatsDClient({
            host: 'localhost',
            port: PORT,
            packetQueue: { flush: 10 }
        });

        client.timing('foo', 42);
        server.once('message', function (msg) {
            assert.equal(msg.toString(), 'foo:42|ms\n');

            server.close();
            client.close();
            assert.end();
        });
    });
});

test('client.counter()', function t(assert) {
    var server = UDPServer({ port: PORT }, function onBound() {
        var sock = new StatsDClient({
            host: 'localhost',
            port: PORT,
            packetQueue: { flush: 10 }
        });

        server.once('message', onMessage);
        sock.counter('hello', 10);

        function onMessage(msg) {
            var str = String(msg);
            assert.equal(str, 'hello:10|c\n');

            sock.close();
            server.close();
            assert.end();
        }
    });
});

test('client.gauge()', function t(assert) {
    var server = UDPServer({ port: PORT }, function onBound() {
        var sock = new StatsDClient({
            host: 'localhost',
            port: PORT,
            packetQueue: { flush: 10 }
        });

        server.once('message', onMessage);
        sock.gauge('hello', 10);

        function onMessage(msg) {
            var str = String(msg);
            assert.equal(str, 'hello:10|g');

            sock.close();
            server.close();
            assert.end();
        }
    });
});
