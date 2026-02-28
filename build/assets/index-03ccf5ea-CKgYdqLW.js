import { M as Xi, R as es, c as ts, q as rs, Q as Ge, w as ns, b as os, F as tt, __tla as __tla_0 } from "./index-CQAX7jVl.js";
Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    var is = Object.defineProperty, ss = (e, t, r)=>t in e ? is(e, t, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: r
        }) : e[t] = r, Ce = (e, t, r)=>(ss(e, typeof t != "symbol" ? t + "" : t, r), r), mo = {
        exports: {}
    }, ct = typeof Reflect == "object" ? Reflect : null, dn = ct && typeof ct.apply == "function" ? ct.apply : function(e, t, r) {
        return Function.prototype.apply.call(e, t, r);
    }, Yt;
    ct && typeof ct.ownKeys == "function" ? Yt = ct.ownKeys : Object.getOwnPropertySymbols ? Yt = function(e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    } : Yt = function(e) {
        return Object.getOwnPropertyNames(e);
    };
    function fs(e) {
        console && console.warn && console.warn(e);
    }
    var vo = Number.isNaN || function(e) {
        return e !== e;
    };
    function G() {
        G.init.call(this);
    }
    mo.exports = G;
    mo.exports.once = us;
    G.EventEmitter = G;
    G.prototype._events = void 0;
    G.prototype._eventsCount = 0;
    G.prototype._maxListeners = void 0;
    var pn = 10;
    function Qt(e) {
        if (typeof e != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
    }
    Object.defineProperty(G, "defaultMaxListeners", {
        enumerable: !0,
        get: function() {
            return pn;
        },
        set: function(e) {
            if (typeof e != "number" || e < 0 || vo(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
            pn = e;
        }
    });
    G.init = function() {
        (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    };
    G.prototype.setMaxListeners = function(e) {
        if (typeof e != "number" || e < 0 || vo(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
        return this._maxListeners = e, this;
    };
    function xo(e) {
        return e._maxListeners === void 0 ? G.defaultMaxListeners : e._maxListeners;
    }
    G.prototype.getMaxListeners = function() {
        return xo(this);
    };
    G.prototype.emit = function(e) {
        for(var t = [], r = 1; r < arguments.length; r++)t.push(arguments[r]);
        var n = e === "error", i = this._events;
        if (i !== void 0) n = n && i.error === void 0;
        else if (!n) return !1;
        if (n) {
            var o;
            if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
            var s = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
            throw s.context = o, s;
        }
        var f = i[e];
        if (f === void 0) return !1;
        if (typeof f == "function") dn(f, this, t);
        else for(var c = f.length, l = So(f, c), r = 0; r < c; ++r)dn(l[r], this, t);
        return !0;
    };
    function Eo(e, t, r, n) {
        var i, o, s;
        if (Qt(r), o = e._events, o === void 0 ? (o = e._events = Object.create(null), e._eventsCount = 0) : (o.newListener !== void 0 && (e.emit("newListener", t, r.listener ? r.listener : r), o = e._events), s = o[t]), s === void 0) s = o[t] = r, ++e._eventsCount;
        else if (typeof s == "function" ? s = o[t] = n ? [
            r,
            s
        ] : [
            s,
            r
        ] : n ? s.unshift(r) : s.push(r), i = xo(e), i > 0 && s.length > i && !s.warned) {
            s.warned = !0;
            var f = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            f.name = "MaxListenersExceededWarning", f.emitter = e, f.type = t, f.count = s.length, fs(f);
        }
        return e;
    }
    G.prototype.addListener = function(e, t) {
        return Eo(this, e, t, !1);
    };
    G.prototype.on = G.prototype.addListener;
    G.prototype.prependListener = function(e, t) {
        return Eo(this, e, t, !0);
    };
    function as() {
        if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function Ao(e, t, r) {
        var n = {
            fired: !1,
            wrapFn: void 0,
            target: e,
            type: t,
            listener: r
        }, i = as.bind(n);
        return i.listener = r, n.wrapFn = i, i;
    }
    G.prototype.once = function(e, t) {
        return Qt(t), this.on(e, Ao(this, e, t)), this;
    };
    G.prototype.prependOnceListener = function(e, t) {
        return Qt(t), this.prependListener(e, Ao(this, e, t)), this;
    };
    G.prototype.removeListener = function(e, t) {
        var r, n, i, o, s;
        if (Qt(t), n = this._events, n === void 0) return this;
        if (r = n[e], r === void 0) return this;
        if (r === t || r.listener === t) --this._eventsCount === 0 ? this._events = Object.create(null) : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));
        else if (typeof r != "function") {
            for(i = -1, o = r.length - 1; o >= 0; o--)if (r[o] === t || r[o].listener === t) {
                s = r[o].listener, i = o;
                break;
            }
            if (i < 0) return this;
            i === 0 ? r.shift() : cs(r, i), r.length === 1 && (n[e] = r[0]), n.removeListener !== void 0 && this.emit("removeListener", e, s || t);
        }
        return this;
    };
    G.prototype.off = G.prototype.removeListener;
    G.prototype.removeAllListeners = function(e) {
        var t, r, n;
        if (r = this._events, r === void 0) return this;
        if (r.removeListener === void 0) return arguments.length === 0 ? (this._events = Object.create(null), this._eventsCount = 0) : r[e] !== void 0 && (--this._eventsCount === 0 ? this._events = Object.create(null) : delete r[e]), this;
        if (arguments.length === 0) {
            var i = Object.keys(r), o;
            for(n = 0; n < i.length; ++n)o = i[n], o !== "removeListener" && this.removeAllListeners(o);
            return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
        }
        if (t = r[e], typeof t == "function") this.removeListener(e, t);
        else if (t !== void 0) for(n = t.length - 1; n >= 0; n--)this.removeListener(e, t[n]);
        return this;
    };
    function _o(e, t, r) {
        var n = e._events;
        if (n === void 0) return [];
        var i = n[t];
        return i === void 0 ? [] : typeof i == "function" ? r ? [
            i.listener || i
        ] : [
            i
        ] : r ? ls(i) : So(i, i.length);
    }
    G.prototype.listeners = function(e) {
        return _o(this, e, !0);
    };
    G.prototype.rawListeners = function(e) {
        return _o(this, e, !1);
    };
    G.listenerCount = function(e, t) {
        return typeof e.listenerCount == "function" ? e.listenerCount(t) : Oo.call(e, t);
    };
    G.prototype.listenerCount = Oo;
    function Oo(e) {
        var t = this._events;
        if (t !== void 0) {
            var r = t[e];
            if (typeof r == "function") return 1;
            if (r !== void 0) return r.length;
        }
        return 0;
    }
    G.prototype.eventNames = function() {
        return this._eventsCount > 0 ? Yt(this._events) : [];
    };
    function So(e, t) {
        for(var r = new Array(t), n = 0; n < t; ++n)r[n] = e[n];
        return r;
    }
    function cs(e, t) {
        for(; t + 1 < e.length; t++)e[t] = e[t + 1];
        e.pop();
    }
    function ls(e) {
        for(var t = new Array(e.length), r = 0; r < t.length; ++r)t[r] = e[r].listener || e[r];
        return t;
    }
    function us(e, t) {
        return new Promise(function(r, n) {
            function i(s) {
                e.removeListener(t, o), n(s);
            }
            function o() {
                typeof e.removeListener == "function" && e.removeListener("error", i), r([].slice.call(arguments));
            }
            Bo(e, t, o, {
                once: !0
            }), t !== "error" && hs(e, i, {
                once: !0
            });
        });
    }
    function hs(e, t, r) {
        typeof e.on == "function" && Bo(e, "error", t, r);
    }
    function Bo(e, t, r, n) {
        if (typeof e.on == "function") n.once ? e.once(t, r) : e.on(t, r);
        else if (typeof e.addEventListener == "function") e.addEventListener(t, function i(o) {
            n.once && e.removeEventListener(t, i), r(o);
        });
        else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
    }
    var K = {};
    var Ar = function(e, t) {
        return Ar = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(r, n) {
            r.__proto__ = n;
        } || function(r, n) {
            for(var i in n)n.hasOwnProperty(i) && (r[i] = n[i]);
        }, Ar(e, t);
    };
    function ds(e, t) {
        Ar(e, t);
        function r() {
            this.constructor = e;
        }
        e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r);
    }
    var _r = function() {
        return _r = Object.assign || function(e) {
            for(var t, r = 1, n = arguments.length; r < n; r++){
                t = arguments[r];
                for(var i in t)Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            }
            return e;
        }, _r.apply(this, arguments);
    };
    function ps(e, t) {
        var r = {};
        for(var n in e)Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
        if (e != null && typeof Object.getOwnPropertySymbols == "function") for(var i = 0, n = Object.getOwnPropertySymbols(e); i < n.length; i++)t.indexOf(n[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[i]) && (r[n[i]] = e[n[i]]);
        return r;
    }
    function bs(e, t, r, n) {
        var i = arguments.length, o = i < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, r) : n, s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(e, t, r, n);
        else for(var f = e.length - 1; f >= 0; f--)(s = e[f]) && (o = (i < 3 ? s(o) : i > 3 ? s(t, r, o) : s(t, r)) || o);
        return i > 3 && o && Object.defineProperty(t, r, o), o;
    }
    function gs(e, t) {
        return function(r, n) {
            t(r, n, e);
        };
    }
    function ys(e, t) {
        if (typeof Reflect == "object" && typeof Reflect.metadata == "function") return Reflect.metadata(e, t);
    }
    function ws(e, t, r, n) {
        function i(o) {
            return o instanceof r ? o : new r(function(s) {
                s(o);
            });
        }
        return new (r || (r = Promise))(function(o, s) {
            function f(a) {
                try {
                    l(n.next(a));
                } catch (u) {
                    s(u);
                }
            }
            function c(a) {
                try {
                    l(n.throw(a));
                } catch (u) {
                    s(u);
                }
            }
            function l(a) {
                a.done ? o(a.value) : i(a.value).then(f, c);
            }
            l((n = n.apply(e, t || [])).next());
        });
    }
    function ms(e, t) {
        var r = {
            label: 0,
            sent: function() {
                if (o[0] & 1) throw o[1];
                return o[1];
            },
            trys: [],
            ops: []
        }, n, i, o, s;
        return s = {
            next: f(0),
            throw: f(1),
            return: f(2)
        }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
            return this;
        }), s;
        function f(l) {
            return function(a) {
                return c([
                    l,
                    a
                ]);
            };
        }
        function c(l) {
            if (n) throw new TypeError("Generator is already executing.");
            for(; r;)try {
                if (n = 1, i && (o = l[0] & 2 ? i.return : l[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, l[1])).done) return o;
                switch(i = 0, o && (l = [
                    l[0] & 2,
                    o.value
                ]), l[0]){
                    case 0:
                    case 1:
                        o = l;
                        break;
                    case 4:
                        return r.label++, {
                            value: l[1],
                            done: !1
                        };
                    case 5:
                        r.label++, i = l[1], l = [
                            0
                        ];
                        continue;
                    case 7:
                        l = r.ops.pop(), r.trys.pop();
                        continue;
                    default:
                        if (o = r.trys, !(o = o.length > 0 && o[o.length - 1]) && (l[0] === 6 || l[0] === 2)) {
                            r = 0;
                            continue;
                        }
                        if (l[0] === 3 && (!o || l[1] > o[0] && l[1] < o[3])) {
                            r.label = l[1];
                            break;
                        }
                        if (l[0] === 6 && r.label < o[1]) {
                            r.label = o[1], o = l;
                            break;
                        }
                        if (o && r.label < o[2]) {
                            r.label = o[2], r.ops.push(l);
                            break;
                        }
                        o[2] && r.ops.pop(), r.trys.pop();
                        continue;
                }
                l = t.call(e, r);
            } catch (a) {
                l = [
                    6,
                    a
                ], i = 0;
            } finally{
                n = o = 0;
            }
            if (l[0] & 5) throw l[1];
            return {
                value: l[0] ? l[1] : void 0,
                done: !0
            };
        }
    }
    function vs(e, t, r, n) {
        n === void 0 && (n = r), e[n] = t[r];
    }
    function xs(e, t) {
        for(var r in e)r !== "default" && !t.hasOwnProperty(r) && (t[r] = e[r]);
    }
    function Or(e) {
        var t = typeof Symbol == "function" && Symbol.iterator, r = t && e[t], n = 0;
        if (r) return r.call(e);
        if (e && typeof e.length == "number") return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
        throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function Uo(e, t) {
        var r = typeof Symbol == "function" && e[Symbol.iterator];
        if (!r) return e;
        var n = r.call(e), i, o = [], s;
        try {
            for(; (t === void 0 || t-- > 0) && !(i = n.next()).done;)o.push(i.value);
        } catch (f) {
            s = {
                error: f
            };
        } finally{
            try {
                i && !i.done && (r = n.return) && r.call(n);
            } finally{
                if (s) throw s.error;
            }
        }
        return o;
    }
    function Es() {
        for(var e = [], t = 0; t < arguments.length; t++)e = e.concat(Uo(arguments[t]));
        return e;
    }
    function As() {
        for(var e = 0, t = 0, r = arguments.length; t < r; t++)e += arguments[t].length;
        for(var n = Array(e), i = 0, t = 0; t < r; t++)for(var o = arguments[t], s = 0, f = o.length; s < f; s++, i++)n[i] = o[s];
        return n;
    }
    function Ot(e) {
        return this instanceof Ot ? (this.v = e, this) : new Ot(e);
    }
    function _s(e, t, r) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var n = r.apply(e, t || []), i, o = [];
        return i = {}, s("next"), s("throw"), s("return"), i[Symbol.asyncIterator] = function() {
            return this;
        }, i;
        function s(d) {
            n[d] && (i[d] = function(p) {
                return new Promise(function(h, b) {
                    o.push([
                        d,
                        p,
                        h,
                        b
                    ]) > 1 || f(d, p);
                });
            });
        }
        function f(d, p) {
            try {
                c(n[d](p));
            } catch (h) {
                u(o[0][3], h);
            }
        }
        function c(d) {
            d.value instanceof Ot ? Promise.resolve(d.value.v).then(l, a) : u(o[0][2], d);
        }
        function l(d) {
            f("next", d);
        }
        function a(d) {
            f("throw", d);
        }
        function u(d, p) {
            d(p), o.shift(), o.length && f(o[0][0], o[0][1]);
        }
    }
    function Os(e) {
        var t, r;
        return t = {}, n("next"), n("throw", function(i) {
            throw i;
        }), n("return"), t[Symbol.iterator] = function() {
            return this;
        }, t;
        function n(i, o) {
            t[i] = e[i] ? function(s) {
                return (r = !r) ? {
                    value: Ot(e[i](s)),
                    done: i === "return"
                } : o ? o(s) : s;
            } : o;
        }
    }
    function Ss(e) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var t = e[Symbol.asyncIterator], r;
        return t ? t.call(e) : (e = typeof Or == "function" ? Or(e) : e[Symbol.iterator](), r = {}, n("next"), n("throw"), n("return"), r[Symbol.asyncIterator] = function() {
            return this;
        }, r);
        function n(o) {
            r[o] = e[o] && function(s) {
                return new Promise(function(f, c) {
                    s = e[o](s), i(f, c, s.done, s.value);
                });
            };
        }
        function i(o, s, f, c) {
            Promise.resolve(c).then(function(l) {
                o({
                    value: l,
                    done: f
                });
            }, s);
        }
    }
    function Bs(e, t) {
        return Object.defineProperty ? Object.defineProperty(e, "raw", {
            value: t
        }) : e.raw = t, e;
    }
    function Us(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (e != null) for(var r in e)Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t;
    }
    function Ns(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    }
    function Is(e, t) {
        if (!t.has(e)) throw new TypeError("attempted to get private field on non-instance");
        return t.get(e);
    }
    function Ls(e, t, r) {
        if (!t.has(e)) throw new TypeError("attempted to set private field on non-instance");
        return t.set(e, r), r;
    }
    const Ts = Object.freeze(Object.defineProperty({
        __proto__: null,
        get __assign () {
            return _r;
        },
        __asyncDelegator: Os,
        __asyncGenerator: _s,
        __asyncValues: Ss,
        __await: Ot,
        __awaiter: ws,
        __classPrivateFieldGet: Is,
        __classPrivateFieldSet: Ls,
        __createBinding: vs,
        __decorate: bs,
        __exportStar: xs,
        __extends: ds,
        __generator: ms,
        __importDefault: Ns,
        __importStar: Us,
        __makeTemplateObject: Bs,
        __metadata: ys,
        __param: gs,
        __read: Uo,
        __rest: ps,
        __spread: Es,
        __spreadArrays: As,
        __values: Or
    }, Symbol.toStringTag, {
        value: "Module"
    })), It = Xi(Ts);
    var bn = {}, pt = {}, gn;
    function Cs() {
        if (gn) return pt;
        gn = 1, Object.defineProperty(pt, "__esModule", {
            value: !0
        }), pt.delay = void 0;
        function e(t) {
            return new Promise((r)=>{
                setTimeout(()=>{
                    r(!0);
                }, t);
            });
        }
        return pt.delay = e, pt;
    }
    var We = {}, yn = {}, rt = {}, wn;
    function Ps() {
        return wn || (wn = 1, Object.defineProperty(rt, "__esModule", {
            value: !0
        }), rt.ONE_THOUSAND = rt.ONE_HUNDRED = void 0, rt.ONE_HUNDRED = 100, rt.ONE_THOUSAND = 1e3), rt;
    }
    var mn = {}, vn;
    function js() {
        return vn || (vn = 1, (function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.ONE_YEAR = e.FOUR_WEEKS = e.THREE_WEEKS = e.TWO_WEEKS = e.ONE_WEEK = e.THIRTY_DAYS = e.SEVEN_DAYS = e.FIVE_DAYS = e.THREE_DAYS = e.ONE_DAY = e.TWENTY_FOUR_HOURS = e.TWELVE_HOURS = e.SIX_HOURS = e.THREE_HOURS = e.ONE_HOUR = e.SIXTY_MINUTES = e.THIRTY_MINUTES = e.TEN_MINUTES = e.FIVE_MINUTES = e.ONE_MINUTE = e.SIXTY_SECONDS = e.THIRTY_SECONDS = e.TEN_SECONDS = e.FIVE_SECONDS = e.ONE_SECOND = void 0, e.ONE_SECOND = 1, e.FIVE_SECONDS = 5, e.TEN_SECONDS = 10, e.THIRTY_SECONDS = 30, e.SIXTY_SECONDS = 60, e.ONE_MINUTE = e.SIXTY_SECONDS, e.FIVE_MINUTES = e.ONE_MINUTE * 5, e.TEN_MINUTES = e.ONE_MINUTE * 10, e.THIRTY_MINUTES = e.ONE_MINUTE * 30, e.SIXTY_MINUTES = e.ONE_MINUTE * 60, e.ONE_HOUR = e.SIXTY_MINUTES, e.THREE_HOURS = e.ONE_HOUR * 3, e.SIX_HOURS = e.ONE_HOUR * 6, e.TWELVE_HOURS = e.ONE_HOUR * 12, e.TWENTY_FOUR_HOURS = e.ONE_HOUR * 24, e.ONE_DAY = e.TWENTY_FOUR_HOURS, e.THREE_DAYS = e.ONE_DAY * 3, e.FIVE_DAYS = e.ONE_DAY * 5, e.SEVEN_DAYS = e.ONE_DAY * 7, e.THIRTY_DAYS = e.ONE_DAY * 30, e.ONE_WEEK = e.SEVEN_DAYS, e.TWO_WEEKS = e.ONE_WEEK * 2, e.THREE_WEEKS = e.ONE_WEEK * 3, e.FOUR_WEEKS = e.ONE_WEEK * 4, e.ONE_YEAR = e.ONE_DAY * 365;
        })(mn)), mn;
    }
    var xn;
    function No() {
        return xn || (xn = 1, (function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            const t = It;
            t.__exportStar(Ps(), e), t.__exportStar(js(), e);
        })(yn)), yn;
    }
    var En;
    function Rs() {
        if (En) return We;
        En = 1, Object.defineProperty(We, "__esModule", {
            value: !0
        }), We.fromMiliseconds = We.toMiliseconds = void 0;
        const e = No();
        function t(n) {
            return n * e.ONE_THOUSAND;
        }
        We.toMiliseconds = t;
        function r(n) {
            return Math.floor(n / e.ONE_THOUSAND);
        }
        return We.fromMiliseconds = r, We;
    }
    var An;
    function zs() {
        return An || (An = 1, (function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            const t = It;
            t.__exportStar(Cs(), e), t.__exportStar(Rs(), e);
        })(bn)), bn;
    }
    var nt = {}, _n;
    function ks() {
        if (_n) return nt;
        _n = 1, Object.defineProperty(nt, "__esModule", {
            value: !0
        }), nt.Watch = void 0;
        class e {
            constructor(){
                this.timestamps = new Map;
            }
            start(r) {
                if (this.timestamps.has(r)) throw new Error(`Watch already started for label: ${r}`);
                this.timestamps.set(r, {
                    started: Date.now()
                });
            }
            stop(r) {
                const n = this.get(r);
                if (typeof n.elapsed < "u") throw new Error(`Watch already stopped for label: ${r}`);
                const i = Date.now() - n.started;
                this.timestamps.set(r, {
                    started: n.started,
                    elapsed: i
                });
            }
            get(r) {
                const n = this.timestamps.get(r);
                if (typeof n > "u") throw new Error(`No timestamp found for label: ${r}`);
                return n;
            }
            elapsed(r) {
                const n = this.get(r);
                return n.elapsed || Date.now() - n.started;
            }
        }
        return nt.Watch = e, nt.default = e, nt;
    }
    var On = {}, bt = {}, Sn;
    function Ms() {
        if (Sn) return bt;
        Sn = 1, Object.defineProperty(bt, "__esModule", {
            value: !0
        }), bt.IWatch = void 0;
        class e {
        }
        return bt.IWatch = e, bt;
    }
    var Bn;
    function Hs() {
        return Bn || (Bn = 1, (function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), It.__exportStar(Ms(), e);
        })(On)), On;
    }
    (function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        const t = It;
        t.__exportStar(zs(), e), t.__exportStar(ks(), e), t.__exportStar(Hs(), e), t.__exportStar(No(), e);
    })(K);
    K.FIVE_SECONDS;
    (function() {
        let e;
        function t() {}
        e = t, e.prototype.getItem = function(r) {
            return this.hasOwnProperty(r) ? String(this[r]) : null;
        }, e.prototype.setItem = function(r, n) {
            this[r] = String(n);
        }, e.prototype.removeItem = function(r) {
            delete this[r];
        }, e.prototype.clear = function() {
            const r = this;
            Object.keys(r).forEach(function(n) {
                r[n] = void 0, delete r[n];
            });
        }, e.prototype.key = function(r) {
            return r = r || 0, Object.keys(this)[r];
        }, e.prototype.__defineGetter__("length", function() {
            return Object.keys(this).length;
        });
    })();
    function Fs(e) {
        try {
            return JSON.stringify(e);
        } catch  {
            return '"[Circular]"';
        }
    }
    var Ds = qs;
    function qs(e, t, r) {
        var n = r && r.stringify || Fs, i = 1;
        if (typeof e == "object" && e !== null) {
            var o = t.length + i;
            if (o === 1) return e;
            var s = new Array(o);
            s[0] = n(e);
            for(var f = 1; f < o; f++)s[f] = n(t[f]);
            return s.join(" ");
        }
        if (typeof e != "string") return e;
        var c = t.length;
        if (c === 0) return e;
        for(var l = "", a = 1 - i, u = -1, d = e && e.length || 0, p = 0; p < d;){
            if (e.charCodeAt(p) === 37 && p + 1 < d) {
                switch(u = u > -1 ? u : 0, e.charCodeAt(p + 1)){
                    case 100:
                    case 102:
                        if (a >= c || t[a] == null) break;
                        u < p && (l += e.slice(u, p)), l += Number(t[a]), u = p + 2, p++;
                        break;
                    case 105:
                        if (a >= c || t[a] == null) break;
                        u < p && (l += e.slice(u, p)), l += Math.floor(Number(t[a])), u = p + 2, p++;
                        break;
                    case 79:
                    case 111:
                    case 106:
                        if (a >= c || t[a] === void 0) break;
                        u < p && (l += e.slice(u, p));
                        var h = typeof t[a];
                        if (h === "string") {
                            l += "'" + t[a] + "'", u = p + 2, p++;
                            break;
                        }
                        if (h === "function") {
                            l += t[a].name || "<anonymous>", u = p + 2, p++;
                            break;
                        }
                        l += n(t[a]), u = p + 2, p++;
                        break;
                    case 115:
                        if (a >= c) break;
                        u < p && (l += e.slice(u, p)), l += String(t[a]), u = p + 2, p++;
                        break;
                    case 37:
                        u < p && (l += e.slice(u, p)), l += "%", u = p + 2, p++, a--;
                        break;
                }
                ++a;
            }
            ++p;
        }
        return u === -1 ? e : (u < d && (l += e.slice(u)), l);
    }
    const Un = Ds, St = Xs().console || {}, Vs = {
        mapHttpRequest: Rt,
        mapHttpResponse: Rt,
        wrapRequestSerializer: ar,
        wrapResponseSerializer: ar,
        wrapErrorSerializer: ar,
        req: Rt,
        res: Rt,
        err: Ws
    };
    function Ks(e, t) {
        return Array.isArray(e) ? e.filter(function(r) {
            return r !== "!stdSerializers.err";
        }) : e === !0 ? Object.keys(t) : !1;
    }
    function Le(e) {
        e = e || {}, e.browser = e.browser || {};
        const t = e.browser.transmit;
        if (t && typeof t.send != "function") throw Error("pino: transmit option must have a send function");
        const r = e.browser.write || St;
        e.browser.write && (e.browser.asObject = !0);
        const n = e.serializers || {}, i = Ks(e.browser.serialize, n);
        let o = e.browser.serialize;
        Array.isArray(e.browser.serialize) && e.browser.serialize.indexOf("!stdSerializers.err") > -1 && (o = !1);
        const s = [
            "error",
            "fatal",
            "warn",
            "info",
            "debug",
            "trace"
        ];
        typeof r == "function" && (r.error = r.fatal = r.warn = r.info = r.debug = r.trace = r), e.enabled === !1 && (e.level = "silent");
        const f = e.level || "info", c = Object.create(r);
        c.log || (c.log = Bt), Object.defineProperty(c, "levelVal", {
            get: a
        }), Object.defineProperty(c, "level", {
            get: u,
            set: d
        });
        const l = {
            transmit: t,
            serialize: i,
            asObject: e.browser.asObject,
            levels: s,
            timestamp: Zs(e)
        };
        c.levels = Le.levels, c.level = f, c.setMaxListeners = c.getMaxListeners = c.emit = c.addListener = c.on = c.prependListener = c.once = c.prependOnceListener = c.removeListener = c.removeAllListeners = c.listeners = c.listenerCount = c.eventNames = c.write = c.flush = Bt, c.serializers = n, c._serialize = i, c._stdErrSerialize = o, c.child = p, t && (c._logEvent = Sr());
        function a() {
            return this.level === "silent" ? 1 / 0 : this.levels.values[this.level];
        }
        function u() {
            return this._level;
        }
        function d(h) {
            if (h !== "silent" && !this.levels.values[h]) throw Error("unknown level " + h);
            this._level = h, ot(l, c, "error", "log"), ot(l, c, "fatal", "error"), ot(l, c, "warn", "error"), ot(l, c, "info", "log"), ot(l, c, "debug", "log"), ot(l, c, "trace", "log");
        }
        function p(h, b) {
            if (!h) throw new Error("missing bindings for child Pino");
            b = b || {}, i && h.serializers && (b.serializers = h.serializers);
            const m = b.serializers;
            if (i && m) {
                var L = Object.assign({}, n, m), E = e.browser.serialize === !0 ? Object.keys(L) : i;
                delete h.serializers, Xt([
                    h
                ], E, L, this._stdErrSerialize);
            }
            function S(N) {
                this._childLevel = (N._childLevel | 0) + 1, this.error = it(N, h, "error"), this.fatal = it(N, h, "fatal"), this.warn = it(N, h, "warn"), this.info = it(N, h, "info"), this.debug = it(N, h, "debug"), this.trace = it(N, h, "trace"), L && (this.serializers = L, this._serialize = E), t && (this._logEvent = Sr([].concat(N._logEvent.bindings, h)));
            }
            return S.prototype = this, new S(this);
        }
        return c;
    }
    Le.levels = {
        values: {
            fatal: 60,
            error: 50,
            warn: 40,
            info: 30,
            debug: 20,
            trace: 10
        },
        labels: {
            10: "trace",
            20: "debug",
            30: "info",
            40: "warn",
            50: "error",
            60: "fatal"
        }
    };
    Le.stdSerializers = Vs;
    Le.stdTimeFunctions = Object.assign({}, {
        nullTime: Io,
        epochTime: Lo,
        unixTime: Js,
        isoTime: Qs
    });
    function ot(e, t, r, n) {
        const i = Object.getPrototypeOf(t);
        t[r] = t.levelVal > t.levels.values[r] ? Bt : i[r] ? i[r] : St[r] || St[n] || Bt, $s(e, t, r);
    }
    function $s(e, t, r) {
        !e.transmit && t[r] === Bt || (t[r] = (function(n) {
            return function() {
                const i = e.timestamp(), o = new Array(arguments.length), s = Object.getPrototypeOf && Object.getPrototypeOf(this) === St ? St : this;
                for(var f = 0; f < o.length; f++)o[f] = arguments[f];
                if (e.serialize && !e.asObject && Xt(o, this._serialize, this.serializers, this._stdErrSerialize), e.asObject ? n.call(s, Ys(this, r, o, i)) : n.apply(s, o), e.transmit) {
                    const c = e.transmit.level || t.level, l = Le.levels.values[c], a = Le.levels.values[r];
                    if (a < l) return;
                    Gs(this, {
                        ts: i,
                        methodLevel: r,
                        methodValue: a,
                        transmitValue: Le.levels.values[e.transmit.level || t.level],
                        send: e.transmit.send,
                        val: t.levelVal
                    }, o);
                }
            };
        })(t[r]));
    }
    function Ys(e, t, r, n) {
        e._serialize && Xt(r, e._serialize, e.serializers, e._stdErrSerialize);
        const i = r.slice();
        let o = i[0];
        const s = {};
        n && (s.time = n), s.level = Le.levels.values[t];
        let f = (e._childLevel | 0) + 1;
        if (f < 1 && (f = 1), o !== null && typeof o == "object") {
            for(; f-- && typeof i[0] == "object";)Object.assign(s, i.shift());
            o = i.length ? Un(i.shift(), i) : void 0;
        } else typeof o == "string" && (o = Un(i.shift(), i));
        return o !== void 0 && (s.msg = o), s;
    }
    function Xt(e, t, r, n) {
        for(const i in e)if (n && e[i] instanceof Error) e[i] = Le.stdSerializers.err(e[i]);
        else if (typeof e[i] == "object" && !Array.isArray(e[i])) for(const o in e[i])t && t.indexOf(o) > -1 && o in r && (e[i][o] = r[o](e[i][o]));
    }
    function it(e, t, r) {
        return function() {
            const n = new Array(1 + arguments.length);
            n[0] = t;
            for(var i = 1; i < n.length; i++)n[i] = arguments[i - 1];
            return e[r].apply(this, n);
        };
    }
    function Gs(e, t, r) {
        const n = t.send, i = t.ts, o = t.methodLevel, s = t.methodValue, f = t.val, c = e._logEvent.bindings;
        Xt(r, e._serialize || Object.keys(e.serializers), e.serializers, e._stdErrSerialize === void 0 ? !0 : e._stdErrSerialize), e._logEvent.ts = i, e._logEvent.messages = r.filter(function(l) {
            return c.indexOf(l) === -1;
        }), e._logEvent.level.label = o, e._logEvent.level.value = s, n(o, e._logEvent, f), e._logEvent = Sr(c);
    }
    function Sr(e) {
        return {
            ts: 0,
            messages: [],
            bindings: e || [],
            level: {
                label: "",
                value: 0
            }
        };
    }
    function Ws(e) {
        const t = {
            type: e.constructor.name,
            msg: e.message,
            stack: e.stack
        };
        for(const r in e)t[r] === void 0 && (t[r] = e[r]);
        return t;
    }
    function Zs(e) {
        return typeof e.timestamp == "function" ? e.timestamp : e.timestamp === !1 ? Io : Lo;
    }
    function Rt() {
        return {};
    }
    function ar(e) {
        return e;
    }
    function Bt() {}
    function Io() {
        return !1;
    }
    function Lo() {
        return Date.now();
    }
    function Js() {
        return Math.round(Date.now() / 1e3);
    }
    function Qs() {
        return new Date(Date.now()).toISOString();
    }
    function Xs() {
        function e(t) {
            return typeof t < "u" && t;
        }
        try {
            return typeof globalThis < "u" || Object.defineProperty(Object.prototype, "globalThis", {
                get: function() {
                    return delete Object.prototype.globalThis, this.globalThis = this;
                },
                configurable: !0
            }), globalThis;
        } catch  {
            return e(self) || e(window) || e(this) || {};
        }
    }
    function ef(e) {
        return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
    }
    function To(e, ...t) {
        if (!ef(e)) throw new Error("Uint8Array expected");
        if (t.length > 0 && !t.includes(e.length)) throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
    }
    function Nn(e, t = !0) {
        if (e.destroyed) throw new Error("Hash instance has been destroyed");
        if (t && e.finished) throw new Error("Hash#digest() has already been called");
    }
    function tf(e, t) {
        To(e);
        const r = t.outputLen;
        if (e.length < r) throw new Error("digestInto() expects output buffer of length at least " + r);
    }
    const st = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    const cr = (e)=>new DataView(e.buffer, e.byteOffset, e.byteLength);
    function rf(e) {
        if (typeof e != "string") throw new Error("utf8ToBytes expected string, got " + typeof e);
        return new Uint8Array(new TextEncoder().encode(e));
    }
    function Co(e) {
        return typeof e == "string" && (e = rf(e)), To(e), e;
    }
    let nf = class {
        clone() {
            return this._cloneInto();
        }
    };
    function of(e) {
        const t = (n)=>e().update(Co(n)).digest(), r = e();
        return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = ()=>e(), t;
    }
    function sf(e = 32) {
        if (st && typeof st.getRandomValues == "function") return st.getRandomValues(new Uint8Array(e));
        if (st && typeof st.randomBytes == "function") return st.randomBytes(e);
        throw new Error("crypto.getRandomValues must be defined");
    }
    function ff(e, t, r, n) {
        if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, r, n);
        const i = BigInt(32), o = BigInt(4294967295), s = Number(r >> i & o), f = Number(r & o), c = n ? 4 : 0, l = n ? 0 : 4;
        e.setUint32(t + c, s, n), e.setUint32(t + l, f, n);
    }
    let af = class extends nf {
        constructor(e, t, r, n){
            super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = cr(this.buffer);
        }
        update(e) {
            Nn(this);
            const { view: t, buffer: r, blockLen: n } = this;
            e = Co(e);
            const i = e.length;
            for(let o = 0; o < i;){
                const s = Math.min(n - this.pos, i - o);
                if (s === n) {
                    const f = cr(e);
                    for(; n <= i - o; o += n)this.process(f, o);
                    continue;
                }
                r.set(e.subarray(o, o + s), this.pos), this.pos += s, o += s, this.pos === n && (this.process(t, 0), this.pos = 0);
            }
            return this.length += e.length, this.roundClean(), this;
        }
        digestInto(e) {
            Nn(this), tf(e, this), this.finished = !0;
            const { buffer: t, view: r, blockLen: n, isLE: i } = this;
            let { pos: o } = this;
            t[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > n - o && (this.process(r, 0), o = 0);
            for(let a = o; a < n; a++)t[a] = 0;
            ff(r, n - 8, BigInt(this.length * 8), i), this.process(r, 0);
            const s = cr(e), f = this.outputLen;
            if (f % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const c = f / 4, l = this.get();
            if (c > l.length) throw new Error("_sha2: outputLen bigger than state");
            for(let a = 0; a < c; a++)s.setUint32(4 * a, l[a], i);
        }
        digest() {
            const { buffer: e, outputLen: t } = this;
            this.digestInto(e);
            const r = e.slice(0, t);
            return this.destroy(), r;
        }
        _cloneInto(e) {
            e || (e = new this.constructor), e.set(...this.get());
            const { blockLen: t, buffer: r, length: n, finished: i, destroyed: o, pos: s } = this;
            return e.length = n, e.pos = s, e.finished = i, e.destroyed = o, n % t && e.buffer.set(r), e;
        }
    };
    const zt = BigInt(2 ** 32 - 1), Br = BigInt(32);
    function Po(e, t = !1) {
        return t ? {
            h: Number(e & zt),
            l: Number(e >> Br & zt)
        } : {
            h: Number(e >> Br & zt) | 0,
            l: Number(e & zt) | 0
        };
    }
    function cf(e, t = !1) {
        let r = new Uint32Array(e.length), n = new Uint32Array(e.length);
        for(let i = 0; i < e.length; i++){
            const { h: o, l: s } = Po(e[i], t);
            [r[i], n[i]] = [
                o,
                s
            ];
        }
        return [
            r,
            n
        ];
    }
    const lf = (e, t)=>BigInt(e >>> 0) << Br | BigInt(t >>> 0), uf = (e, t, r)=>e >>> r, hf = (e, t, r)=>e << 32 - r | t >>> r, df = (e, t, r)=>e >>> r | t << 32 - r, pf = (e, t, r)=>e << 32 - r | t >>> r, bf = (e, t, r)=>e << 64 - r | t >>> r - 32, gf = (e, t, r)=>e >>> r - 32 | t << 64 - r, yf = (e, t)=>t, wf = (e, t)=>e, mf = (e, t, r)=>e << r | t >>> 32 - r, vf = (e, t, r)=>t << r | e >>> 32 - r, xf = (e, t, r)=>t << r - 32 | e >>> 64 - r, Ef = (e, t, r)=>e << r - 32 | t >>> 64 - r;
    function Af(e, t, r, n) {
        const i = (t >>> 0) + (n >>> 0);
        return {
            h: e + r + (i / 2 ** 32 | 0) | 0,
            l: i | 0
        };
    }
    const _f = (e, t, r)=>(e >>> 0) + (t >>> 0) + (r >>> 0), Of = (e, t, r, n)=>t + r + n + (e / 2 ** 32 | 0) | 0, Sf = (e, t, r, n)=>(e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0), Bf = (e, t, r, n, i)=>t + r + n + i + (e / 2 ** 32 | 0) | 0, Uf = (e, t, r, n, i)=>(e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0), Nf = (e, t, r, n, i, o)=>t + r + n + i + o + (e / 2 ** 32 | 0) | 0, q = {
        fromBig: Po,
        split: cf,
        toBig: lf,
        shrSH: uf,
        shrSL: hf,
        rotrSH: df,
        rotrSL: pf,
        rotrBH: bf,
        rotrBL: gf,
        rotr32H: yf,
        rotr32L: wf,
        rotlSH: mf,
        rotlSL: vf,
        rotlBH: xf,
        rotlBL: Ef,
        add: Af,
        add3L: _f,
        add3H: Of,
        add4L: Sf,
        add4H: Bf,
        add5H: Nf,
        add5L: Uf
    }, [If, Lf] = q.split([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
    ].map((e)=>BigInt(e))), Pe = new Uint32Array(80), je = new Uint32Array(80);
    let Tf = class extends af {
        constructor(){
            super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
        }
        get() {
            const { Ah: e, Al: t, Bh: r, Bl: n, Ch: i, Cl: o, Dh: s, Dl: f, Eh: c, El: l, Fh: a, Fl: u, Gh: d, Gl: p, Hh: h, Hl: b } = this;
            return [
                e,
                t,
                r,
                n,
                i,
                o,
                s,
                f,
                c,
                l,
                a,
                u,
                d,
                p,
                h,
                b
            ];
        }
        set(e, t, r, n, i, o, s, f, c, l, a, u, d, p, h, b) {
            this.Ah = e | 0, this.Al = t | 0, this.Bh = r | 0, this.Bl = n | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = s | 0, this.Dl = f | 0, this.Eh = c | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = u | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = h | 0, this.Hl = b | 0;
        }
        process(e, t) {
            for(let E = 0; E < 16; E++, t += 4)Pe[E] = e.getUint32(t), je[E] = e.getUint32(t += 4);
            for(let E = 16; E < 80; E++){
                const S = Pe[E - 15] | 0, N = je[E - 15] | 0, T = q.rotrSH(S, N, 1) ^ q.rotrSH(S, N, 8) ^ q.shrSH(S, N, 7), M = q.rotrSL(S, N, 1) ^ q.rotrSL(S, N, 8) ^ q.shrSL(S, N, 7), j = Pe[E - 2] | 0, I = je[E - 2] | 0, g = q.rotrSH(j, I, 19) ^ q.rotrBH(j, I, 61) ^ q.shrSH(j, I, 6), B = q.rotrSL(j, I, 19) ^ q.rotrBL(j, I, 61) ^ q.shrSL(j, I, 6), w = q.add4L(M, B, je[E - 7], je[E - 16]), A = q.add4H(w, T, g, Pe[E - 7], Pe[E - 16]);
                Pe[E] = A | 0, je[E] = w | 0;
            }
            let { Ah: r, Al: n, Bh: i, Bl: o, Ch: s, Cl: f, Dh: c, Dl: l, Eh: a, El: u, Fh: d, Fl: p, Gh: h, Gl: b, Hh: m, Hl: L } = this;
            for(let E = 0; E < 80; E++){
                const S = q.rotrSH(a, u, 14) ^ q.rotrSH(a, u, 18) ^ q.rotrBH(a, u, 41), N = q.rotrSL(a, u, 14) ^ q.rotrSL(a, u, 18) ^ q.rotrBL(a, u, 41), T = a & d ^ ~a & h, M = u & p ^ ~u & b, j = q.add5L(L, N, M, Lf[E], je[E]), I = q.add5H(j, m, S, T, If[E], Pe[E]), g = j | 0, B = q.rotrSH(r, n, 28) ^ q.rotrBH(r, n, 34) ^ q.rotrBH(r, n, 39), w = q.rotrSL(r, n, 28) ^ q.rotrBL(r, n, 34) ^ q.rotrBL(r, n, 39), A = r & i ^ r & s ^ i & s, U = n & o ^ n & f ^ o & f;
                m = h | 0, L = b | 0, h = d | 0, b = p | 0, d = a | 0, p = u | 0, { h: a, l: u } = q.add(c | 0, l | 0, I | 0, g | 0), c = s | 0, l = f | 0, s = i | 0, f = o | 0, i = r | 0, o = n | 0;
                const P = q.add3L(g, w, U);
                r = q.add3H(P, I, B, A), n = P | 0;
            }
            ({ h: r, l: n } = q.add(this.Ah | 0, this.Al | 0, r | 0, n | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: s, l: f } = q.add(this.Ch | 0, this.Cl | 0, s | 0, f | 0), { h: c, l } = q.add(this.Dh | 0, this.Dl | 0, c | 0, l | 0), { h: a, l: u } = q.add(this.Eh | 0, this.El | 0, a | 0, u | 0), { h: d, l: p } = q.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h, l: b } = q.add(this.Gh | 0, this.Gl | 0, h | 0, b | 0), { h: m, l: L } = q.add(this.Hh | 0, this.Hl | 0, m | 0, L | 0), this.set(r, n, i, o, s, f, c, l, a, u, d, p, h, b, m, L);
        }
        roundClean() {
            Pe.fill(0), je.fill(0);
        }
        destroy() {
            this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    };
    const Cf = of(()=>new Tf);
    const Fr = BigInt(0), jo = BigInt(1), Pf = BigInt(2);
    function Dr(e) {
        return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
    }
    function qr(e) {
        if (!Dr(e)) throw new Error("Uint8Array expected");
    }
    function lr(e, t) {
        if (typeof t != "boolean") throw new Error(e + " boolean expected, got " + t);
    }
    const jf = Array.from({
        length: 256
    }, (e, t)=>t.toString(16).padStart(2, "0"));
    function Vr(e) {
        qr(e);
        let t = "";
        for(let r = 0; r < e.length; r++)t += jf[e[r]];
        return t;
    }
    function Ro(e) {
        if (typeof e != "string") throw new Error("hex string expected, got " + typeof e);
        return e === "" ? Fr : BigInt("0x" + e);
    }
    const _e = {
        _0: 48,
        _9: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
    };
    function In(e) {
        if (e >= _e._0 && e <= _e._9) return e - _e._0;
        if (e >= _e.A && e <= _e.F) return e - (_e.A - 10);
        if (e >= _e.a && e <= _e.f) return e - (_e.a - 10);
    }
    function zo(e) {
        if (typeof e != "string") throw new Error("hex string expected, got " + typeof e);
        const t = e.length, r = t / 2;
        if (t % 2) throw new Error("hex string expected, got unpadded hex of length " + t);
        const n = new Uint8Array(r);
        for(let i = 0, o = 0; i < r; i++, o += 2){
            const s = In(e.charCodeAt(o)), f = In(e.charCodeAt(o + 1));
            if (s === void 0 || f === void 0) {
                const c = e[o] + e[o + 1];
                throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
            }
            n[i] = s * 16 + f;
        }
        return n;
    }
    function Rf(e) {
        return Ro(Vr(e));
    }
    function Gt(e) {
        return qr(e), Ro(Vr(Uint8Array.from(e).reverse()));
    }
    function ko(e, t) {
        return zo(e.toString(16).padStart(t * 2, "0"));
    }
    function Ur(e, t) {
        return ko(e, t).reverse();
    }
    function Oe(e, t, r) {
        let n;
        if (typeof t == "string") try {
            n = zo(t);
        } catch (o) {
            throw new Error(e + " must be hex string or Uint8Array, cause: " + o);
        }
        else if (Dr(t)) n = Uint8Array.from(t);
        else throw new Error(e + " must be hex string or Uint8Array");
        const i = n.length;
        if (typeof r == "number" && i !== r) throw new Error(e + " of length " + r + " expected, got " + i);
        return n;
    }
    function Ln(...e) {
        let t = 0;
        for(let n = 0; n < e.length; n++){
            const i = e[n];
            qr(i), t += i.length;
        }
        const r = new Uint8Array(t);
        for(let n = 0, i = 0; n < e.length; n++){
            const o = e[n];
            r.set(o, i), i += o.length;
        }
        return r;
    }
    const ur = (e)=>typeof e == "bigint" && Fr <= e;
    function zf(e, t, r) {
        return ur(e) && ur(t) && ur(r) && t <= e && e < r;
    }
    function gt(e, t, r, n) {
        if (!zf(t, r, n)) throw new Error("expected valid " + e + ": " + r + " <= n < " + n + ", got " + t);
    }
    function kf(e) {
        let t;
        for(t = 0; e > Fr; e >>= jo, t += 1);
        return t;
    }
    const Mf = (e)=>(Pf << BigInt(e - 1)) - jo, Hf = {
        bigint: (e)=>typeof e == "bigint",
        function: (e)=>typeof e == "function",
        boolean: (e)=>typeof e == "boolean",
        string: (e)=>typeof e == "string",
        stringOrUint8Array: (e)=>typeof e == "string" || Dr(e),
        isSafeInteger: (e)=>Number.isSafeInteger(e),
        array: (e)=>Array.isArray(e),
        field: (e, t)=>t.Fp.isValid(e),
        hash: (e)=>typeof e == "function" && Number.isSafeInteger(e.outputLen)
    };
    function Kr(e, t, r = {}) {
        const n = (i, o, s)=>{
            const f = Hf[o];
            if (typeof f != "function") throw new Error("invalid validator function");
            const c = e[i];
            if (!(s && c === void 0) && !f(c, e)) throw new Error("param " + String(i) + " is invalid. Expected " + o + ", got " + c);
        };
        for (const [i, o] of Object.entries(t))n(i, o, !1);
        for (const [i, o] of Object.entries(r))n(i, o, !0);
        return e;
    }
    function Tn(e) {
        const t = new WeakMap;
        return (r, ...n)=>{
            const i = t.get(r);
            if (i !== void 0) return i;
            const o = e(r, ...n);
            return t.set(r, o), o;
        };
    }
    const te = BigInt(0), Q = BigInt(1), Ze = BigInt(2), Ff = BigInt(3), Nr = BigInt(4), Cn = BigInt(5), Pn = BigInt(8);
    function ee(e, t) {
        const r = e % t;
        return r >= te ? r : t + r;
    }
    function Df(e, t, r) {
        if (t < te) throw new Error("invalid exponent, negatives unsupported");
        if (r <= te) throw new Error("invalid modulus");
        if (r === Q) return te;
        let n = Q;
        for(; t > te;)t & Q && (n = n * e % r), e = e * e % r, t >>= Q;
        return n;
    }
    function Ee(e, t, r) {
        let n = e;
        for(; t-- > te;)n *= n, n %= r;
        return n;
    }
    function jn(e, t) {
        if (e === te) throw new Error("invert: expected non-zero number");
        if (t <= te) throw new Error("invert: expected positive modulus, got " + t);
        let r = ee(e, t), n = t, i = te, o = Q;
        for(; r !== te;){
            const s = n / r, f = n % r, c = i - o * s;
            n = r, r = f, i = o, o = c;
        }
        if (n !== Q) throw new Error("invert: does not exist");
        return ee(i, t);
    }
    function qf(e) {
        const t = (e - Q) / Ze;
        let r, n, i;
        for(r = e - Q, n = 0; r % Ze === te; r /= Ze, n++);
        for(i = Ze; i < e && Df(i, t, e) !== e - Q; i++)if (i > 1e3) throw new Error("Cannot find square root: likely non-prime P");
        if (n === 1) {
            const s = (e + Q) / Nr;
            return function(f, c) {
                const l = f.pow(c, s);
                if (!f.eql(f.sqr(l), c)) throw new Error("Cannot find square root");
                return l;
            };
        }
        const o = (r + Q) / Ze;
        return function(s, f) {
            if (s.pow(f, t) === s.neg(s.ONE)) throw new Error("Cannot find square root");
            let c = n, l = s.pow(s.mul(s.ONE, i), r), a = s.pow(f, o), u = s.pow(f, r);
            for(; !s.eql(u, s.ONE);){
                if (s.eql(u, s.ZERO)) return s.ZERO;
                let d = 1;
                for(let h = s.sqr(u); d < c && !s.eql(h, s.ONE); d++)h = s.sqr(h);
                const p = s.pow(l, Q << BigInt(c - d - 1));
                l = s.sqr(p), a = s.mul(a, p), u = s.mul(u, l), c = d;
            }
            return a;
        };
    }
    function Vf(e) {
        if (e % Nr === Ff) {
            const t = (e + Q) / Nr;
            return function(r, n) {
                const i = r.pow(n, t);
                if (!r.eql(r.sqr(i), n)) throw new Error("Cannot find square root");
                return i;
            };
        }
        if (e % Pn === Cn) {
            const t = (e - Cn) / Pn;
            return function(r, n) {
                const i = r.mul(n, Ze), o = r.pow(i, t), s = r.mul(n, o), f = r.mul(r.mul(s, Ze), o), c = r.mul(s, r.sub(f, r.ONE));
                if (!r.eql(r.sqr(c), n)) throw new Error("Cannot find square root");
                return c;
            };
        }
        return qf(e);
    }
    const Kf = (e, t)=>(ee(e, t) & Q) === Q, $f = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
    ];
    function Yf(e) {
        const t = {
            ORDER: "bigint",
            MASK: "bigint",
            BYTES: "isSafeInteger",
            BITS: "isSafeInteger"
        }, r = $f.reduce((n, i)=>(n[i] = "function", n), t);
        return Kr(e, r);
    }
    function Gf(e, t, r) {
        if (r < te) throw new Error("invalid exponent, negatives unsupported");
        if (r === te) return e.ONE;
        if (r === Q) return t;
        let n = e.ONE, i = t;
        for(; r > te;)r & Q && (n = e.mul(n, i)), i = e.sqr(i), r >>= Q;
        return n;
    }
    function Wf(e, t) {
        const r = new Array(t.length), n = t.reduce((o, s, f)=>e.is0(s) ? o : (r[f] = o, e.mul(o, s)), e.ONE), i = e.inv(n);
        return t.reduceRight((o, s, f)=>e.is0(s) ? o : (r[f] = e.mul(o, r[f]), e.mul(o, s)), i), r;
    }
    function Mo(e, t) {
        const r = t !== void 0 ? t : e.toString(2).length, n = Math.ceil(r / 8);
        return {
            nBitLength: r,
            nByteLength: n
        };
    }
    function Ho(e, t, r = !1, n = {}) {
        if (e <= te) throw new Error("invalid field: expected ORDER > 0, got " + e);
        const { nBitLength: i, nByteLength: o } = Mo(e, t);
        if (o > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
        let s;
        const f = Object.freeze({
            ORDER: e,
            isLE: r,
            BITS: i,
            BYTES: o,
            MASK: Mf(i),
            ZERO: te,
            ONE: Q,
            create: (c)=>ee(c, e),
            isValid: (c)=>{
                if (typeof c != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof c);
                return te <= c && c < e;
            },
            is0: (c)=>c === te,
            isOdd: (c)=>(c & Q) === Q,
            neg: (c)=>ee(-c, e),
            eql: (c, l)=>c === l,
            sqr: (c)=>ee(c * c, e),
            add: (c, l)=>ee(c + l, e),
            sub: (c, l)=>ee(c - l, e),
            mul: (c, l)=>ee(c * l, e),
            pow: (c, l)=>Gf(f, c, l),
            div: (c, l)=>ee(c * jn(l, e), e),
            sqrN: (c)=>c * c,
            addN: (c, l)=>c + l,
            subN: (c, l)=>c - l,
            mulN: (c, l)=>c * l,
            inv: (c)=>jn(c, e),
            sqrt: n.sqrt || ((c)=>(s || (s = Vf(e)), s(f, c))),
            invertBatch: (c)=>Wf(f, c),
            cmov: (c, l, a)=>a ? l : c,
            toBytes: (c)=>r ? Ur(c, o) : ko(c, o),
            fromBytes: (c)=>{
                if (c.length !== o) throw new Error("Field.fromBytes: expected " + o + " bytes, got " + c.length);
                return r ? Gt(c) : Rf(c);
            }
        });
        return Object.freeze(f);
    }
    const Rn = BigInt(0), kt = BigInt(1);
    function hr(e, t) {
        const r = t.negate();
        return e ? r : t;
    }
    function Fo(e, t) {
        if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
    }
    function dr(e, t) {
        Fo(e, t);
        const r = Math.ceil(t / e) + 1, n = 2 ** (e - 1);
        return {
            windows: r,
            windowSize: n
        };
    }
    function Zf(e, t) {
        if (!Array.isArray(e)) throw new Error("array expected");
        e.forEach((r, n)=>{
            if (!(r instanceof t)) throw new Error("invalid point at index " + n);
        });
    }
    function Jf(e, t) {
        if (!Array.isArray(e)) throw new Error("array of scalars expected");
        e.forEach((r, n)=>{
            if (!t.isValid(r)) throw new Error("invalid scalar at index " + n);
        });
    }
    const pr = new WeakMap, Do = new WeakMap;
    function br(e) {
        return Do.get(e) || 1;
    }
    function Qf(e, t) {
        return {
            constTimeNegate: hr,
            hasPrecomputes (r) {
                return br(r) !== 1;
            },
            unsafeLadder (r, n, i = e.ZERO) {
                let o = r;
                for(; n > Rn;)n & kt && (i = i.add(o)), o = o.double(), n >>= kt;
                return i;
            },
            precomputeWindow (r, n) {
                const { windows: i, windowSize: o } = dr(n, t), s = [];
                let f = r, c = f;
                for(let l = 0; l < i; l++){
                    c = f, s.push(c);
                    for(let a = 1; a < o; a++)c = c.add(f), s.push(c);
                    f = c.double();
                }
                return s;
            },
            wNAF (r, n, i) {
                const { windows: o, windowSize: s } = dr(r, t);
                let f = e.ZERO, c = e.BASE;
                const l = BigInt(2 ** r - 1), a = 2 ** r, u = BigInt(r);
                for(let d = 0; d < o; d++){
                    const p = d * s;
                    let h = Number(i & l);
                    i >>= u, h > s && (h -= a, i += kt);
                    const b = p, m = p + Math.abs(h) - 1, L = d % 2 !== 0, E = h < 0;
                    h === 0 ? c = c.add(hr(L, n[b])) : f = f.add(hr(E, n[m]));
                }
                return {
                    p: f,
                    f: c
                };
            },
            wNAFUnsafe (r, n, i, o = e.ZERO) {
                const { windows: s, windowSize: f } = dr(r, t), c = BigInt(2 ** r - 1), l = 2 ** r, a = BigInt(r);
                for(let u = 0; u < s; u++){
                    const d = u * f;
                    if (i === Rn) break;
                    let p = Number(i & c);
                    if (i >>= a, p > f && (p -= l, i += kt), p === 0) continue;
                    let h = n[d + Math.abs(p) - 1];
                    p < 0 && (h = h.negate()), o = o.add(h);
                }
                return o;
            },
            getPrecomputes (r, n, i) {
                let o = pr.get(n);
                return o || (o = this.precomputeWindow(n, r), r !== 1 && pr.set(n, i(o))), o;
            },
            wNAFCached (r, n, i) {
                const o = br(r);
                return this.wNAF(o, this.getPrecomputes(o, r, i), n);
            },
            wNAFCachedUnsafe (r, n, i, o) {
                const s = br(r);
                return s === 1 ? this.unsafeLadder(r, n, o) : this.wNAFUnsafe(s, this.getPrecomputes(s, r, i), n, o);
            },
            setWindowSize (r, n) {
                Fo(n, t), Do.set(r, n), pr.delete(r);
            }
        };
    }
    function Xf(e, t, r, n) {
        if (Zf(r, e), Jf(n, t), r.length !== n.length) throw new Error("arrays of points and scalars must have equal length");
        const i = e.ZERO, o = kf(BigInt(r.length)), s = o > 12 ? o - 3 : o > 4 ? o - 2 : o ? 2 : 1, f = (1 << s) - 1, c = new Array(f + 1).fill(i), l = Math.floor((t.BITS - 1) / s) * s;
        let a = i;
        for(let u = l; u >= 0; u -= s){
            c.fill(i);
            for(let p = 0; p < n.length; p++){
                const h = n[p], b = Number(h >> BigInt(u) & BigInt(f));
                c[b] = c[b].add(r[p]);
            }
            let d = i;
            for(let p = c.length - 1, h = i; p > 0; p--)h = h.add(c[p]), d = d.add(h);
            if (a = a.add(d), u !== 0) for(let p = 0; p < s; p++)a = a.double();
        }
        return a;
    }
    function ea(e) {
        return Yf(e.Fp), Kr(e, {
            n: "bigint",
            h: "bigint",
            Gx: "field",
            Gy: "field"
        }, {
            nBitLength: "isSafeInteger",
            nByteLength: "isSafeInteger"
        }), Object.freeze({
            ...Mo(e.n, e.nBitLength),
            ...e,
            p: e.Fp.ORDER
        });
    }
    const we = BigInt(0), ue = BigInt(1), Mt = BigInt(2), ta = BigInt(8), ra = {
        zip215: !0
    };
    function na(e) {
        const t = ea(e);
        return Kr(e, {
            hash: "function",
            a: "bigint",
            d: "bigint",
            randomBytes: "function"
        }, {
            adjustScalarBytes: "function",
            domain: "function",
            uvRatio: "function",
            mapToCurve: "function"
        }), Object.freeze({
            ...t
        });
    }
    function oa(e) {
        const t = na(e), { Fp: r, n, prehash: i, hash: o, randomBytes: s, nByteLength: f, h: c } = t, l = Mt << BigInt(f * 8) - ue, a = r.create, u = Ho(t.n, t.nBitLength), d = t.uvRatio || ((x, y)=>{
            try {
                return {
                    isValid: !0,
                    value: r.sqrt(x * r.inv(y))
                };
            } catch  {
                return {
                    isValid: !1,
                    value: we
                };
            }
        }), p = t.adjustScalarBytes || ((x)=>x), h = t.domain || ((x, y, v)=>{
            if (lr("phflag", v), y.length || v) throw new Error("Contexts/pre-hash are not supported");
            return x;
        });
        function b(x, y) {
            gt("coordinate " + x, y, we, l);
        }
        function m(x) {
            if (!(x instanceof S)) throw new Error("ExtendedPoint expected");
        }
        const L = Tn((x, y)=>{
            const { ex: v, ey: _, ez: O } = x, R = x.is0();
            y == null && (y = R ? ta : r.inv(O));
            const C = a(v * y), k = a(_ * y), H = a(O * y);
            if (R) return {
                x: we,
                y: ue
            };
            if (H !== ue) throw new Error("invZ was invalid");
            return {
                x: C,
                y: k
            };
        }), E = Tn((x)=>{
            const { a: y, d: v } = t;
            if (x.is0()) throw new Error("bad point: ZERO");
            const { ex: _, ey: O, ez: R, et: C } = x, k = a(_ * _), H = a(O * O), F = a(R * R), D = a(F * F), V = a(k * y), J = a(F * a(V + H)), W = a(D + a(v * a(k * H)));
            if (J !== W) throw new Error("bad point: equation left != right (1)");
            const Y = a(_ * O), re = a(R * C);
            if (Y !== re) throw new Error("bad point: equation left != right (2)");
            return !0;
        });
        class S {
            constructor(y, v, _, O){
                this.ex = y, this.ey = v, this.ez = _, this.et = O, b("x", y), b("y", v), b("z", _), b("t", O), Object.freeze(this);
            }
            get x() {
                return this.toAffine().x;
            }
            get y() {
                return this.toAffine().y;
            }
            static fromAffine(y) {
                if (y instanceof S) throw new Error("extended point not allowed");
                const { x: v, y: _ } = y || {};
                return b("x", v), b("y", _), new S(v, _, ue, a(v * _));
            }
            static normalizeZ(y) {
                const v = r.invertBatch(y.map((_)=>_.ez));
                return y.map((_, O)=>_.toAffine(v[O])).map(S.fromAffine);
            }
            static msm(y, v) {
                return Xf(S, u, y, v);
            }
            _setWindowSize(y) {
                M.setWindowSize(this, y);
            }
            assertValidity() {
                E(this);
            }
            equals(y) {
                m(y);
                const { ex: v, ey: _, ez: O } = this, { ex: R, ey: C, ez: k } = y, H = a(v * k), F = a(R * O), D = a(_ * k), V = a(C * O);
                return H === F && D === V;
            }
            is0() {
                return this.equals(S.ZERO);
            }
            negate() {
                return new S(a(-this.ex), this.ey, this.ez, a(-this.et));
            }
            double() {
                const { a: y } = t, { ex: v, ey: _, ez: O } = this, R = a(v * v), C = a(_ * _), k = a(Mt * a(O * O)), H = a(y * R), F = v + _, D = a(a(F * F) - R - C), V = H + C, J = V - k, W = H - C, Y = a(D * J), re = a(V * W), be = a(D * W), jt = a(J * V);
                return new S(Y, re, jt, be);
            }
            add(y) {
                m(y);
                const { a: v, d: _ } = t, { ex: O, ey: R, ez: C, et: k } = this, { ex: H, ey: F, ez: D, et: V } = y;
                if (v === BigInt(-1)) {
                    const sn = a((R - O) * (F + H)), fn = a((R + O) * (F - H)), fr = a(fn - sn);
                    if (fr === we) return this.double();
                    const an = a(C * Mt * V), cn = a(k * Mt * D), ln = cn + an, un = fn + sn, hn = cn - an, Wi = a(ln * fr), Zi = a(un * hn), Ji = a(ln * hn), Qi = a(fr * un);
                    return new S(Wi, Zi, Qi, Ji);
                }
                const J = a(O * H), W = a(R * F), Y = a(k * _ * V), re = a(C * D), be = a((O + R) * (H + F) - J - W), jt = re - Y, nn = re + Y, on = a(W - v * J), Ki = a(be * jt), $i = a(nn * on), Yi = a(be * on), Gi = a(jt * nn);
                return new S(Ki, $i, Gi, Yi);
            }
            subtract(y) {
                return this.add(y.negate());
            }
            wNAF(y) {
                return M.wNAFCached(this, y, S.normalizeZ);
            }
            multiply(y) {
                const v = y;
                gt("scalar", v, ue, n);
                const { p: _, f: O } = this.wNAF(v);
                return S.normalizeZ([
                    _,
                    O
                ])[0];
            }
            multiplyUnsafe(y, v = S.ZERO) {
                const _ = y;
                return gt("scalar", _, we, n), _ === we ? T : this.is0() || _ === ue ? this : M.wNAFCachedUnsafe(this, _, S.normalizeZ, v);
            }
            isSmallOrder() {
                return this.multiplyUnsafe(c).is0();
            }
            isTorsionFree() {
                return M.unsafeLadder(this, n).is0();
            }
            toAffine(y) {
                return L(this, y);
            }
            clearCofactor() {
                const { h: y } = t;
                return y === ue ? this : this.multiplyUnsafe(y);
            }
            static fromHex(y, v = !1) {
                const { d: _, a: O } = t, R = r.BYTES;
                y = Oe("pointHex", y, R), lr("zip215", v);
                const C = y.slice(), k = y[R - 1];
                C[R - 1] = k & -129;
                const H = Gt(C), F = v ? l : r.ORDER;
                gt("pointHex.y", H, we, F);
                const D = a(H * H), V = a(D - ue), J = a(_ * D - O);
                let { isValid: W, value: Y } = d(V, J);
                if (!W) throw new Error("Point.fromHex: invalid y coordinate");
                const re = (Y & ue) === ue, be = (k & 128) !== 0;
                if (!v && Y === we && be) throw new Error("Point.fromHex: x=0 and x_0=1");
                return be !== re && (Y = a(-Y)), S.fromAffine({
                    x: Y,
                    y: H
                });
            }
            static fromPrivateKey(y) {
                return g(y).point;
            }
            toRawBytes() {
                const { x: y, y: v } = this.toAffine(), _ = Ur(v, r.BYTES);
                return _[_.length - 1] |= y & ue ? 128 : 0, _;
            }
            toHex() {
                return Vr(this.toRawBytes());
            }
        }
        S.BASE = new S(t.Gx, t.Gy, ue, a(t.Gx * t.Gy)), S.ZERO = new S(we, ue, ue, we);
        const { BASE: N, ZERO: T } = S, M = Qf(S, f * 8);
        function j(x) {
            return ee(x, n);
        }
        function I(x) {
            return j(Gt(x));
        }
        function g(x) {
            const y = r.BYTES;
            x = Oe("private key", x, y);
            const v = Oe("hashed private key", o(x), 2 * y), _ = p(v.slice(0, y)), O = v.slice(y, 2 * y), R = I(_), C = N.multiply(R), k = C.toRawBytes();
            return {
                head: _,
                prefix: O,
                scalar: R,
                point: C,
                pointBytes: k
            };
        }
        function B(x) {
            return g(x).pointBytes;
        }
        function w(x = new Uint8Array, ...y) {
            const v = Ln(...y);
            return I(o(h(v, Oe("context", x), !!i)));
        }
        function A(x, y, v = {}) {
            x = Oe("message", x), i && (x = i(x));
            const { prefix: _, scalar: O, pointBytes: R } = g(y), C = w(v.context, _, x), k = N.multiply(C).toRawBytes(), H = w(v.context, k, R, x), F = j(C + H * O);
            gt("signature.s", F, we, n);
            const D = Ln(k, Ur(F, r.BYTES));
            return Oe("result", D, r.BYTES * 2);
        }
        const U = ra;
        function P(x, y, v, _ = U) {
            const { context: O, zip215: R } = _, C = r.BYTES;
            x = Oe("signature", x, 2 * C), y = Oe("message", y), v = Oe("publicKey", v, C), R !== void 0 && lr("zip215", R), i && (y = i(y));
            const k = Gt(x.slice(C, 2 * C));
            let H, F, D;
            try {
                H = S.fromHex(v, R), F = S.fromHex(x.slice(0, C), R), D = N.multiplyUnsafe(k);
            } catch  {
                return !1;
            }
            if (!R && H.isSmallOrder()) return !1;
            const V = w(O, F.toRawBytes(), H.toRawBytes(), y);
            return F.add(H.multiplyUnsafe(V)).subtract(D).clearCofactor().equals(S.ZERO);
        }
        return N._setWindowSize(8), {
            CURVE: t,
            getPublicKey: B,
            sign: A,
            verify: P,
            ExtendedPoint: S,
            utils: {
                getExtendedPublicKey: g,
                randomPrivateKey: ()=>s(r.BYTES),
                precompute (x = 8, y = S.BASE) {
                    return y._setWindowSize(x), y.multiply(BigInt(3)), y;
                }
            }
        };
    }
    BigInt(0), BigInt(1);
    const $r = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"), zn = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
    BigInt(0);
    const ia = BigInt(1), kn = BigInt(2);
    BigInt(3);
    const sa = BigInt(5), fa = BigInt(8);
    function aa(e) {
        const t = BigInt(10), r = BigInt(20), n = BigInt(40), i = BigInt(80), o = $r, s = e * e % o * e % o, f = Ee(s, kn, o) * s % o, c = Ee(f, ia, o) * e % o, l = Ee(c, sa, o) * c % o, a = Ee(l, t, o) * l % o, u = Ee(a, r, o) * a % o, d = Ee(u, n, o) * u % o, p = Ee(d, i, o) * d % o, h = Ee(p, i, o) * d % o, b = Ee(h, t, o) * l % o;
        return {
            pow_p_5_8: Ee(b, kn, o) * e % o,
            b2: s
        };
    }
    function ca(e) {
        return e[0] &= 248, e[31] &= 127, e[31] |= 64, e;
    }
    function la(e, t) {
        const r = $r, n = ee(t * t * t, r), i = ee(n * n * t, r), o = aa(e * i).pow_p_5_8;
        let s = ee(e * n * o, r);
        const f = ee(t * s * s, r), c = s, l = ee(s * zn, r), a = f === e, u = f === ee(-e, r), d = f === ee(-e * zn, r);
        return a && (s = c), (u || d) && (s = l), Kf(s, r) && (s = ee(-s, r)), {
            isValid: a || u,
            value: s
        };
    }
    const ua = Ho($r, void 0, !0), ha = {
        a: BigInt(-1),
        d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
        Fp: ua,
        n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
        h: fa,
        Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
        Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
        hash: Cf,
        randomBytes: sf,
        adjustScalarBytes: ca,
        uvRatio: la
    };
    oa(ha);
    function da(e, t) {
        if (e.length >= 255) throw new TypeError("Alphabet too long");
        for(var r = new Uint8Array(256), n = 0; n < r.length; n++)r[n] = 255;
        for(var i = 0; i < e.length; i++){
            var o = e.charAt(i), s = o.charCodeAt(0);
            if (r[s] !== 255) throw new TypeError(o + " is ambiguous");
            r[s] = i;
        }
        var f = e.length, c = e.charAt(0), l = Math.log(f) / Math.log(256), a = Math.log(256) / Math.log(f);
        function u(h) {
            if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
            if (h.length === 0) return "";
            for(var b = 0, m = 0, L = 0, E = h.length; L !== E && h[L] === 0;)L++, b++;
            for(var S = (E - L) * a + 1 >>> 0, N = new Uint8Array(S); L !== E;){
                for(var T = h[L], M = 0, j = S - 1; (T !== 0 || M < m) && j !== -1; j--, M++)T += 256 * N[j] >>> 0, N[j] = T % f >>> 0, T = T / f >>> 0;
                if (T !== 0) throw new Error("Non-zero carry");
                m = M, L++;
            }
            for(var I = S - m; I !== S && N[I] === 0;)I++;
            for(var g = c.repeat(b); I < S; ++I)g += e.charAt(N[I]);
            return g;
        }
        function d(h) {
            if (typeof h != "string") throw new TypeError("Expected String");
            if (h.length === 0) return new Uint8Array;
            var b = 0;
            if (h[b] !== " ") {
                for(var m = 0, L = 0; h[b] === c;)m++, b++;
                for(var E = (h.length - b) * l + 1 >>> 0, S = new Uint8Array(E); h[b];){
                    var N = r[h.charCodeAt(b)];
                    if (N === 255) return;
                    for(var T = 0, M = E - 1; (N !== 0 || T < L) && M !== -1; M--, T++)N += f * S[M] >>> 0, S[M] = N % 256 >>> 0, N = N / 256 >>> 0;
                    if (N !== 0) throw new Error("Non-zero carry");
                    L = T, b++;
                }
                if (h[b] !== " ") {
                    for(var j = E - L; j !== E && S[j] === 0;)j++;
                    for(var I = new Uint8Array(m + (E - j)), g = m; j !== E;)I[g++] = S[j++];
                    return I;
                }
            }
        }
        function p(h) {
            var b = d(h);
            if (b) return b;
            throw new Error(`Non-${t} character`);
        }
        return {
            encode: u,
            decodeUnsafe: d,
            decode: p
        };
    }
    var pa = da, ba = pa;
    const qo = (e)=>{
        if (e instanceof Uint8Array && e.constructor.name === "Uint8Array") return e;
        if (e instanceof ArrayBuffer) return new Uint8Array(e);
        if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
        throw new Error("Unknown type, must be binary type");
    }, ga = (e)=>new TextEncoder().encode(e), ya = (e)=>new TextDecoder().decode(e);
    let wa = class {
        constructor(e, t, r){
            this.name = e, this.prefix = t, this.baseEncode = r;
        }
        encode(e) {
            if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
            throw Error("Unknown type, must be binary type");
        }
    }, ma = class {
        constructor(e, t, r){
            if (this.name = e, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
            this.prefixCodePoint = t.codePointAt(0), this.baseDecode = r;
        }
        decode(e) {
            if (typeof e == "string") {
                if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
                return this.baseDecode(e.slice(this.prefix.length));
            } else throw Error("Can only multibase decode strings");
        }
        or(e) {
            return Vo(this, e);
        }
    }, va = class {
        constructor(e){
            this.decoders = e;
        }
        or(e) {
            return Vo(this, e);
        }
        decode(e) {
            const t = e[0], r = this.decoders[t];
            if (r) return r.decode(e);
            throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
    };
    const Vo = (e, t)=>new va({
            ...e.decoders || {
                [e.prefix]: e
            },
            ...t.decoders || {
                [t.prefix]: t
            }
        });
    let xa = class {
        constructor(e, t, r, n){
            this.name = e, this.prefix = t, this.baseEncode = r, this.baseDecode = n, this.encoder = new wa(e, t, r), this.decoder = new ma(e, t, n);
        }
        encode(e) {
            return this.encoder.encode(e);
        }
        decode(e) {
            return this.decoder.decode(e);
        }
    };
    const er = ({ name: e, prefix: t, encode: r, decode: n })=>new xa(e, t, r, n), Lt = ({ prefix: e, name: t, alphabet: r })=>{
        const { encode: n, decode: i } = ba(r, t);
        return er({
            prefix: e,
            name: t,
            encode: n,
            decode: (o)=>qo(i(o))
        });
    }, Ea = (e, t, r, n)=>{
        const i = {};
        for(let a = 0; a < t.length; ++a)i[t[a]] = a;
        let o = e.length;
        for(; e[o - 1] === "=";)--o;
        const s = new Uint8Array(o * r / 8 | 0);
        let f = 0, c = 0, l = 0;
        for(let a = 0; a < o; ++a){
            const u = i[e[a]];
            if (u === void 0) throw new SyntaxError(`Non-${n} character`);
            c = c << r | u, f += r, f >= 8 && (f -= 8, s[l++] = 255 & c >> f);
        }
        if (f >= r || 255 & c << 8 - f) throw new SyntaxError("Unexpected end of data");
        return s;
    }, Aa = (e, t, r)=>{
        const n = t[t.length - 1] === "=", i = (1 << r) - 1;
        let o = "", s = 0, f = 0;
        for(let c = 0; c < e.length; ++c)for(f = f << 8 | e[c], s += 8; s > r;)s -= r, o += t[i & f >> s];
        if (s && (o += t[i & f << r - s]), n) for(; o.length * r & 7;)o += "=";
        return o;
    }, oe = ({ name: e, prefix: t, bitsPerChar: r, alphabet: n })=>er({
            prefix: t,
            name: e,
            encode (i) {
                return Aa(i, n, r);
            },
            decode (i) {
                return Ea(i, n, r, e);
            }
        }), _a = er({
        prefix: "\0",
        name: "identity",
        encode: (e)=>ya(e),
        decode: (e)=>ga(e)
    });
    var Oa = Object.freeze({
        __proto__: null,
        identity: _a
    });
    const Sa = oe({
        prefix: "0",
        name: "base2",
        alphabet: "01",
        bitsPerChar: 1
    });
    var Ba = Object.freeze({
        __proto__: null,
        base2: Sa
    });
    const Ua = oe({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3
    });
    var Na = Object.freeze({
        __proto__: null,
        base8: Ua
    });
    const Ia = Lt({
        prefix: "9",
        name: "base10",
        alphabet: "0123456789"
    });
    var La = Object.freeze({
        __proto__: null,
        base10: Ia
    });
    const Ta = oe({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4
    }), Ca = oe({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4
    });
    var Pa = Object.freeze({
        __proto__: null,
        base16: Ta,
        base16upper: Ca
    });
    const ja = oe({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5
    }), Ra = oe({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5
    }), za = oe({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5
    }), ka = oe({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5
    }), Ma = oe({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5
    }), Ha = oe({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5
    }), Fa = oe({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5
    }), Da = oe({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5
    }), qa = oe({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5
    });
    var Va = Object.freeze({
        __proto__: null,
        base32: ja,
        base32upper: Ra,
        base32pad: za,
        base32padupper: ka,
        base32hex: Ma,
        base32hexupper: Ha,
        base32hexpad: Fa,
        base32hexpadupper: Da,
        base32z: qa
    });
    const Ka = Lt({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
    }), $a = Lt({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
    var Ya = Object.freeze({
        __proto__: null,
        base36: Ka,
        base36upper: $a
    });
    const Ga = Lt({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    }), Wa = Lt({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    });
    var Za = Object.freeze({
        __proto__: null,
        base58btc: Ga,
        base58flickr: Wa
    });
    const Ja = oe({
        prefix: "m",
        name: "base64",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6
    }), Qa = oe({
        prefix: "M",
        name: "base64pad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6
    }), Xa = oe({
        prefix: "u",
        name: "base64url",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6
    }), ec = oe({
        prefix: "U",
        name: "base64urlpad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6
    });
    var tc = Object.freeze({
        __proto__: null,
        base64: Ja,
        base64pad: Qa,
        base64url: Xa,
        base64urlpad: ec
    });
    const Ko = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), rc = Ko.reduce((e, t, r)=>(e[r] = t, e), []), nc = Ko.reduce((e, t, r)=>(e[t.codePointAt(0)] = r, e), []);
    function oc(e) {
        return e.reduce((t, r)=>(t += rc[r], t), "");
    }
    function ic(e) {
        const t = [];
        for (const r of e){
            const n = nc[r.codePointAt(0)];
            if (n === void 0) throw new Error(`Non-base256emoji character: ${r}`);
            t.push(n);
        }
        return new Uint8Array(t);
    }
    const sc = er({
        prefix: "🚀",
        name: "base256emoji",
        encode: oc,
        decode: ic
    });
    var fc = Object.freeze({
        __proto__: null,
        base256emoji: sc
    }), ac = $o, Mn = 128, cc = -128, lc = Math.pow(2, 31);
    function $o(e, t, r) {
        t = t || [], r = r || 0;
        for(var n = r; e >= lc;)t[r++] = e & 255 | Mn, e /= 128;
        for(; e & cc;)t[r++] = e & 255 | Mn, e >>>= 7;
        return t[r] = e | 0, $o.bytes = r - n + 1, t;
    }
    var uc = Ir, hc = 128, Hn = 127;
    function Ir(e, n) {
        var r = 0, n = n || 0, i = 0, o = n, s, f = e.length;
        do {
            if (o >= f) throw Ir.bytes = 0, new RangeError("Could not decode varint");
            s = e[o++], r += i < 28 ? (s & Hn) << i : (s & Hn) * Math.pow(2, i), i += 7;
        }while (s >= hc);
        return Ir.bytes = o - n, r;
    }
    var dc = Math.pow(2, 7), pc = Math.pow(2, 14), bc = Math.pow(2, 21), gc = Math.pow(2, 28), yc = Math.pow(2, 35), wc = Math.pow(2, 42), mc = Math.pow(2, 49), vc = Math.pow(2, 56), xc = Math.pow(2, 63), Ec = function(e) {
        return e < dc ? 1 : e < pc ? 2 : e < bc ? 3 : e < gc ? 4 : e < yc ? 5 : e < wc ? 6 : e < mc ? 7 : e < vc ? 8 : e < xc ? 9 : 10;
    }, Ac = {
        encode: ac,
        decode: uc,
        encodingLength: Ec
    }, Yo = Ac;
    const Fn = (e, t, r = 0)=>(Yo.encode(e, t, r), t), Dn = (e)=>Yo.encodingLength(e), Lr = (e, t)=>{
        const r = t.byteLength, n = Dn(e), i = n + Dn(r), o = new Uint8Array(i + r);
        return Fn(e, o, 0), Fn(r, o, n), o.set(t, i), new _c(e, r, t, o);
    };
    let _c = class {
        constructor(e, t, r, n){
            this.code = e, this.size = t, this.digest = r, this.bytes = n;
        }
    };
    const Go = ({ name: e, code: t, encode: r })=>new Oc(e, t, r);
    let Oc = class {
        constructor(e, t, r){
            this.name = e, this.code = t, this.encode = r;
        }
        digest(e) {
            if (e instanceof Uint8Array) {
                const t = this.encode(e);
                return t instanceof Uint8Array ? Lr(this.code, t) : t.then((r)=>Lr(this.code, r));
            } else throw Error("Unknown type, must be binary type");
        }
    };
    const Wo = (e)=>async (t)=>new Uint8Array(await crypto.subtle.digest(e, t)), Sc = Go({
        name: "sha2-256",
        code: 18,
        encode: Wo("SHA-256")
    }), Bc = Go({
        name: "sha2-512",
        code: 19,
        encode: Wo("SHA-512")
    });
    var Uc = Object.freeze({
        __proto__: null,
        sha256: Sc,
        sha512: Bc
    });
    const Zo = 0, Nc = "identity", Jo = qo, Ic = (e)=>Lr(Zo, Jo(e)), Lc = {
        code: Zo,
        name: Nc,
        encode: Jo,
        digest: Ic
    };
    var Tc = Object.freeze({
        __proto__: null,
        identity: Lc
    });
    new TextEncoder, new TextDecoder;
    ({
        ...Oa,
        ...Ba,
        ...Na,
        ...La,
        ...Pa,
        ...Va,
        ...Ya,
        ...Za,
        ...tc,
        ...fc
    });
    ({
        ...Uc,
        ...Tc
    });
    var Z = {};
    Object.defineProperty(Z, "__esModule", {
        value: !0
    });
    Z.getLocalStorage = Z.getLocalStorageOrThrow = Z.getCrypto = Z.getCryptoOrThrow = Z.getLocation = Z.getLocationOrThrow = Z.getNavigator = Z.getNavigatorOrThrow = Z.getDocument = Z.getDocumentOrThrow = Z.getFromWindowOrThrow = Z.getFromWindow = void 0;
    function et(e) {
        let t;
        return typeof window < "u" && typeof window[e] < "u" && (t = window[e]), t;
    }
    Z.getFromWindow = et;
    function ht(e) {
        const t = et(e);
        if (!t) throw new Error(`${e} is not defined in Window`);
        return t;
    }
    Z.getFromWindowOrThrow = ht;
    function Cc() {
        return ht("document");
    }
    Z.getDocumentOrThrow = Cc;
    function Pc() {
        return et("document");
    }
    Z.getDocument = Pc;
    function jc() {
        return ht("navigator");
    }
    Z.getNavigatorOrThrow = jc;
    function Rc() {
        return et("navigator");
    }
    Z.getNavigator = Rc;
    function zc() {
        return ht("location");
    }
    Z.getLocationOrThrow = zc;
    function kc() {
        return et("location");
    }
    Z.getLocation = kc;
    function Mc() {
        return ht("crypto");
    }
    Z.getCryptoOrThrow = Mc;
    function Hc() {
        return et("crypto");
    }
    Z.getCrypto = Hc;
    function Fc() {
        return ht("localStorage");
    }
    Z.getLocalStorageOrThrow = Fc;
    function Dc() {
        return et("localStorage");
    }
    Z.getLocalStorage = Dc;
    var Yr = {};
    Object.defineProperty(Yr, "__esModule", {
        value: !0
    });
    Yr.getWindowMetadata = void 0;
    const qn = Z;
    function qc() {
        let e, t;
        try {
            e = qn.getDocumentOrThrow(), t = qn.getLocationOrThrow();
        } catch  {
            return null;
        }
        function r() {
            const a = e.getElementsByTagName("link"), u = [];
            for(let d = 0; d < a.length; d++){
                const p = a[d], h = p.getAttribute("rel");
                if (h && h.toLowerCase().indexOf("icon") > -1) {
                    const b = p.getAttribute("href");
                    if (b) if (b.toLowerCase().indexOf("https:") === -1 && b.toLowerCase().indexOf("http:") === -1 && b.indexOf("//") !== 0) {
                        let m = t.protocol + "//" + t.host;
                        if (b.indexOf("/") === 0) m += b;
                        else {
                            const L = t.pathname.split("/");
                            L.pop();
                            const E = L.join("/");
                            m += E + "/" + b;
                        }
                        u.push(m);
                    } else if (b.indexOf("//") === 0) {
                        const m = t.protocol + b;
                        u.push(m);
                    } else u.push(b);
                }
            }
            return u;
        }
        function n(...a) {
            const u = e.getElementsByTagName("meta");
            for(let d = 0; d < u.length; d++){
                const p = u[d], h = [
                    "itemprop",
                    "property",
                    "name"
                ].map((b)=>p.getAttribute(b)).filter((b)=>b ? a.includes(b) : !1);
                if (h.length && h) {
                    const b = p.getAttribute("content");
                    if (b) return b;
                }
            }
            return "";
        }
        function i() {
            let a = n("name", "og:site_name", "og:title", "twitter:title");
            return a || (a = e.title), a;
        }
        function o() {
            return n("description", "og:description", "twitter:description", "keywords");
        }
        const s = i(), f = o(), c = t.origin, l = r();
        return {
            description: f,
            url: c,
            icons: l,
            name: s
        };
    }
    Yr.getWindowMetadata = qc;
    const Ht = BigInt(2 ** 32 - 1), Vn = BigInt(32);
    function Vc(e, t = !1) {
        return t ? {
            h: Number(e & Ht),
            l: Number(e >> Vn & Ht)
        } : {
            h: Number(e >> Vn & Ht) | 0,
            l: Number(e & Ht) | 0
        };
    }
    function Kc(e, t = !1) {
        const r = e.length;
        let n = new Uint32Array(r), i = new Uint32Array(r);
        for(let o = 0; o < r; o++){
            const { h: s, l: f } = Vc(e[o], t);
            [n[o], i[o]] = [
                s,
                f
            ];
        }
        return [
            n,
            i
        ];
    }
    const $c = BigInt(0), yt = BigInt(1), Yc = BigInt(2), Gc = BigInt(7), Wc = BigInt(256), Zc = BigInt(113), Qo = [];
    for(let e = 0, t = yt, r = 1, n = 0; e < 24; e++){
        [r, n] = [
            n,
            (2 * r + 3 * n) % 5
        ];
        let i = $c;
        for(let o = 0; o < 7; o++)t = (t << yt ^ (t >> Gc) * Zc) % Wc, t & Yc && (i ^= yt << (yt << BigInt(o)) - yt);
        Qo.push(i);
    }
    Kc(Qo, !0);
    function Jc(e) {
        if (e.length >= 255) throw new TypeError("Alphabet too long");
        const t = new Uint8Array(256);
        for(let l = 0; l < t.length; l++)t[l] = 255;
        for(let l = 0; l < e.length; l++){
            const a = e.charAt(l), u = a.charCodeAt(0);
            if (t[u] !== 255) throw new TypeError(a + " is ambiguous");
            t[u] = l;
        }
        const r = e.length, n = e.charAt(0), i = Math.log(r) / Math.log(256), o = Math.log(256) / Math.log(r);
        function s(l) {
            if (l instanceof Uint8Array || (ArrayBuffer.isView(l) ? l = new Uint8Array(l.buffer, l.byteOffset, l.byteLength) : Array.isArray(l) && (l = Uint8Array.from(l))), !(l instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
            if (l.length === 0) return "";
            let a = 0, u = 0, d = 0;
            const p = l.length;
            for(; d !== p && l[d] === 0;)d++, a++;
            const h = (p - d) * o + 1 >>> 0, b = new Uint8Array(h);
            for(; d !== p;){
                let E = l[d], S = 0;
                for(let N = h - 1; (E !== 0 || S < u) && N !== -1; N--, S++)E += 256 * b[N] >>> 0, b[N] = E % r >>> 0, E = E / r >>> 0;
                if (E !== 0) throw new Error("Non-zero carry");
                u = S, d++;
            }
            let m = h - u;
            for(; m !== h && b[m] === 0;)m++;
            let L = n.repeat(a);
            for(; m < h; ++m)L += e.charAt(b[m]);
            return L;
        }
        function f(l) {
            if (typeof l != "string") throw new TypeError("Expected String");
            if (l.length === 0) return new Uint8Array;
            let a = 0, u = 0, d = 0;
            for(; l[a] === n;)u++, a++;
            const p = (l.length - a) * i + 1 >>> 0, h = new Uint8Array(p);
            for(; a < l.length;){
                const E = l.charCodeAt(a);
                if (E > 255) return;
                let S = t[E];
                if (S === 255) return;
                let N = 0;
                for(let T = p - 1; (S !== 0 || N < d) && T !== -1; T--, N++)S += r * h[T] >>> 0, h[T] = S % 256 >>> 0, S = S / 256 >>> 0;
                if (S !== 0) throw new Error("Non-zero carry");
                d = N, a++;
            }
            let b = p - d;
            for(; b !== p && h[b] === 0;)b++;
            const m = new Uint8Array(u + (p - b));
            let L = u;
            for(; b !== p;)m[L++] = h[b++];
            return m;
        }
        function c(l) {
            const a = f(l);
            if (a) return a;
            throw new Error("Non-base" + r + " character");
        }
        return {
            encode: s,
            decodeUnsafe: f,
            decode: c
        };
    }
    var Qc = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    Jc(Qc);
    new TextEncoder;
    const Xc = 4096;
    function el(e, t, r) {
        let n = t;
        const i = n + r, o = [];
        let s = "";
        for(; n < i;){
            const f = e[n++];
            if (!(f & 128)) o.push(f);
            else if ((f & 224) === 192) {
                const c = e[n++] & 63;
                o.push((f & 31) << 6 | c);
            } else if ((f & 240) === 224) {
                const c = e[n++] & 63, l = e[n++] & 63;
                o.push((f & 31) << 12 | c << 6 | l);
            } else if ((f & 248) === 240) {
                const c = e[n++] & 63, l = e[n++] & 63, a = e[n++] & 63;
                let u = (f & 7) << 18 | c << 12 | l << 6 | a;
                u > 65535 && (u -= 65536, o.push(u >>> 10 & 1023 | 55296), u = 56320 | u & 1023), o.push(u);
            } else o.push(f);
            o.length >= Xc && (s += String.fromCharCode(...o), o.length = 0);
        }
        return o.length > 0 && (s += String.fromCharCode(...o)), s;
    }
    new TextDecoder;
    class Ft {
        constructor(t, r){
            this.type = t, this.data = r;
        }
    }
    class Wt extends Error {
        constructor(t){
            super(t);
            const r = Object.create(Wt.prototype);
            Object.setPrototypeOf(this, r), Object.defineProperty(this, "name", {
                configurable: !0,
                enumerable: !1,
                value: Wt.name
            });
        }
    }
    function tl(e, t, r) {
        const n = Math.floor(r / 4294967296), i = r;
        e.setUint32(t, n), e.setUint32(t + 4, i);
    }
    function rl(e, t) {
        const r = e.getInt32(t), n = e.getUint32(t + 4);
        return r * 4294967296 + n;
    }
    const nl = -1, ol = 4294967296 - 1, il = 17179869184 - 1;
    function sl({ sec: e, nsec: t }) {
        if (e >= 0 && t >= 0 && e <= il) if (t === 0 && e <= ol) {
            const r = new Uint8Array(4);
            return new DataView(r.buffer).setUint32(0, e), r;
        } else {
            const r = e / 4294967296, n = e & 4294967295, i = new Uint8Array(8), o = new DataView(i.buffer);
            return o.setUint32(0, t << 2 | r & 3), o.setUint32(4, n), i;
        }
        else {
            const r = new Uint8Array(12), n = new DataView(r.buffer);
            return n.setUint32(0, t), tl(n, 4, e), r;
        }
    }
    function fl(e) {
        const t = e.getTime(), r = Math.floor(t / 1e3), n = (t - r * 1e3) * 1e6, i = Math.floor(n / 1e9);
        return {
            sec: r + i,
            nsec: n - i * 1e9
        };
    }
    function al(e) {
        if (e instanceof Date) {
            const t = fl(e);
            return sl(t);
        } else return null;
    }
    function cl(e) {
        const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
        switch(e.byteLength){
            case 4:
                return {
                    sec: t.getUint32(0),
                    nsec: 0
                };
            case 8:
                {
                    const r = t.getUint32(0), n = t.getUint32(4), i = (r & 3) * 4294967296 + n, o = r >>> 2;
                    return {
                        sec: i,
                        nsec: o
                    };
                }
            case 12:
                {
                    const r = rl(t, 4), n = t.getUint32(0);
                    return {
                        sec: r,
                        nsec: n
                    };
                }
            default:
                throw new Wt(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${e.length}`);
        }
    }
    function ll(e) {
        const t = cl(e);
        return new Date(t.sec * 1e3 + t.nsec / 1e6);
    }
    const ul = {
        type: nl,
        encode: al,
        decode: ll
    };
    class Kn {
        constructor(){
            this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(ul);
        }
        register({ type: t, encode: r, decode: n }) {
            if (t >= 0) this.encoders[t] = r, this.decoders[t] = n;
            else {
                const i = -1 - t;
                this.builtInEncoders[i] = r, this.builtInDecoders[i] = n;
            }
        }
        tryToEncode(t, r) {
            for(let n = 0; n < this.builtInEncoders.length; n++){
                const i = this.builtInEncoders[n];
                if (i != null) {
                    const o = i(t, r);
                    if (o != null) {
                        const s = -1 - n;
                        return new Ft(s, o);
                    }
                }
            }
            for(let n = 0; n < this.encoders.length; n++){
                const i = this.encoders[n];
                if (i != null) {
                    const o = i(t, r);
                    if (o != null) {
                        const s = n;
                        return new Ft(s, o);
                    }
                }
            }
            return t instanceof Ft ? t : null;
        }
        decode(t, r, n) {
            const i = r < 0 ? this.builtInDecoders[-1 - r] : this.decoders[r];
            return i ? i(t, r, n) : new Ft(r, t);
        }
    }
    Kn.defaultCodec = new Kn;
    const hl = 16, dl = 16;
    class pl {
        constructor(t = hl, r = dl){
            this.hit = 0, this.miss = 0, this.maxKeyLength = t, this.maxLengthPerKey = r, this.caches = [];
            for(let n = 0; n < this.maxKeyLength; n++)this.caches.push([]);
        }
        canBeCached(t) {
            return t > 0 && t <= this.maxKeyLength;
        }
        find(t, r, n) {
            const i = this.caches[n - 1];
            e: for (const o of i){
                const s = o.bytes;
                for(let f = 0; f < n; f++)if (s[f] !== t[r + f]) continue e;
                return o.str;
            }
            return null;
        }
        store(t, r) {
            const n = this.caches[t.length - 1], i = {
                bytes: t,
                str: r
            };
            n.length >= this.maxLengthPerKey ? n[Math.random() * n.length | 0] = i : n.push(i);
        }
        decode(t, r, n) {
            const i = this.find(t, r, n);
            if (i != null) return this.hit++, i;
            this.miss++;
            const o = el(t, r, n), s = Uint8Array.prototype.slice.call(t, r, r + n);
            return this.store(s, o), o;
        }
    }
    const Xo = new DataView(new ArrayBuffer(0));
    new Uint8Array(Xo.buffer);
    try {
        Xo.getInt8(0);
    } catch (e) {
        if (!(e instanceof RangeError)) throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
    }
    new pl;
    function bl(e, t) {
        if (e.length >= 255) throw new TypeError("Alphabet too long");
        for(var r = new Uint8Array(256), n = 0; n < r.length; n++)r[n] = 255;
        for(var i = 0; i < e.length; i++){
            var o = e.charAt(i), s = o.charCodeAt(0);
            if (r[s] !== 255) throw new TypeError(o + " is ambiguous");
            r[s] = i;
        }
        var f = e.length, c = e.charAt(0), l = Math.log(f) / Math.log(256), a = Math.log(256) / Math.log(f);
        function u(h) {
            if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
            if (h.length === 0) return "";
            for(var b = 0, m = 0, L = 0, E = h.length; L !== E && h[L] === 0;)L++, b++;
            for(var S = (E - L) * a + 1 >>> 0, N = new Uint8Array(S); L !== E;){
                for(var T = h[L], M = 0, j = S - 1; (T !== 0 || M < m) && j !== -1; j--, M++)T += 256 * N[j] >>> 0, N[j] = T % f >>> 0, T = T / f >>> 0;
                if (T !== 0) throw new Error("Non-zero carry");
                m = M, L++;
            }
            for(var I = S - m; I !== S && N[I] === 0;)I++;
            for(var g = c.repeat(b); I < S; ++I)g += e.charAt(N[I]);
            return g;
        }
        function d(h) {
            if (typeof h != "string") throw new TypeError("Expected String");
            if (h.length === 0) return new Uint8Array;
            var b = 0;
            if (h[b] !== " ") {
                for(var m = 0, L = 0; h[b] === c;)m++, b++;
                for(var E = (h.length - b) * l + 1 >>> 0, S = new Uint8Array(E); h[b];){
                    var N = r[h.charCodeAt(b)];
                    if (N === 255) return;
                    for(var T = 0, M = E - 1; (N !== 0 || T < L) && M !== -1; M--, T++)N += f * S[M] >>> 0, S[M] = N % 256 >>> 0, N = N / 256 >>> 0;
                    if (N !== 0) throw new Error("Non-zero carry");
                    L = T, b++;
                }
                if (h[b] !== " ") {
                    for(var j = E - L; j !== E && S[j] === 0;)j++;
                    for(var I = new Uint8Array(m + (E - j)), g = m; j !== E;)I[g++] = S[j++];
                    return I;
                }
            }
        }
        function p(h) {
            var b = d(h);
            if (b) return b;
            throw new Error(`Non-${t} character`);
        }
        return {
            encode: u,
            decodeUnsafe: d,
            decode: p
        };
    }
    var gl = bl, yl = gl;
    const wl = (e)=>{
        if (e instanceof Uint8Array && e.constructor.name === "Uint8Array") return e;
        if (e instanceof ArrayBuffer) return new Uint8Array(e);
        if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
        throw new Error("Unknown type, must be binary type");
    }, ml = (e)=>new TextEncoder().encode(e), vl = (e)=>new TextDecoder().decode(e);
    class xl {
        constructor(t, r, n){
            this.name = t, this.prefix = r, this.baseEncode = n;
        }
        encode(t) {
            if (t instanceof Uint8Array) return `${this.prefix}${this.baseEncode(t)}`;
            throw Error("Unknown type, must be binary type");
        }
    }
    class El {
        constructor(t, r, n){
            if (this.name = t, this.prefix = r, r.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
            this.prefixCodePoint = r.codePointAt(0), this.baseDecode = n;
        }
        decode(t) {
            if (typeof t == "string") {
                if (t.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
                return this.baseDecode(t.slice(this.prefix.length));
            } else throw Error("Can only multibase decode strings");
        }
        or(t) {
            return ei(this, t);
        }
    }
    class Al {
        constructor(t){
            this.decoders = t;
        }
        or(t) {
            return ei(this, t);
        }
        decode(t) {
            const r = t[0], n = this.decoders[r];
            if (n) return n.decode(t);
            throw RangeError(`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
    }
    const ei = (e, t)=>new Al({
            ...e.decoders || {
                [e.prefix]: e
            },
            ...t.decoders || {
                [t.prefix]: t
            }
        });
    class _l {
        constructor(t, r, n, i){
            this.name = t, this.prefix = r, this.baseEncode = n, this.baseDecode = i, this.encoder = new xl(t, r, n), this.decoder = new El(t, r, i);
        }
        encode(t) {
            return this.encoder.encode(t);
        }
        decode(t) {
            return this.decoder.decode(t);
        }
    }
    const tr = ({ name: e, prefix: t, encode: r, decode: n })=>new _l(e, t, r, n), Tt = ({ prefix: e, name: t, alphabet: r })=>{
        const { encode: n, decode: i } = yl(r, t);
        return tr({
            prefix: e,
            name: t,
            encode: n,
            decode: (o)=>wl(i(o))
        });
    }, Ol = (e, t, r, n)=>{
        const i = {};
        for(let a = 0; a < t.length; ++a)i[t[a]] = a;
        let o = e.length;
        for(; e[o - 1] === "=";)--o;
        const s = new Uint8Array(o * r / 8 | 0);
        let f = 0, c = 0, l = 0;
        for(let a = 0; a < o; ++a){
            const u = i[e[a]];
            if (u === void 0) throw new SyntaxError(`Non-${n} character`);
            c = c << r | u, f += r, f >= 8 && (f -= 8, s[l++] = 255 & c >> f);
        }
        if (f >= r || 255 & c << 8 - f) throw new SyntaxError("Unexpected end of data");
        return s;
    }, Sl = (e, t, r)=>{
        const n = t[t.length - 1] === "=", i = (1 << r) - 1;
        let o = "", s = 0, f = 0;
        for(let c = 0; c < e.length; ++c)for(f = f << 8 | e[c], s += 8; s > r;)s -= r, o += t[i & f >> s];
        if (s && (o += t[i & f << r - s]), n) for(; o.length * r & 7;)o += "=";
        return o;
    }, ie = ({ name: e, prefix: t, bitsPerChar: r, alphabet: n })=>tr({
            prefix: t,
            name: e,
            encode (i) {
                return Sl(i, n, r);
            },
            decode (i) {
                return Ol(i, n, r, e);
            }
        }), Bl = tr({
        prefix: "\0",
        name: "identity",
        encode: (e)=>vl(e),
        decode: (e)=>ml(e)
    }), Ul = Object.freeze(Object.defineProperty({
        __proto__: null,
        identity: Bl
    }, Symbol.toStringTag, {
        value: "Module"
    })), Nl = ie({
        prefix: "0",
        name: "base2",
        alphabet: "01",
        bitsPerChar: 1
    }), Il = Object.freeze(Object.defineProperty({
        __proto__: null,
        base2: Nl
    }, Symbol.toStringTag, {
        value: "Module"
    })), Ll = ie({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3
    }), Tl = Object.freeze(Object.defineProperty({
        __proto__: null,
        base8: Ll
    }, Symbol.toStringTag, {
        value: "Module"
    })), Cl = Tt({
        prefix: "9",
        name: "base10",
        alphabet: "0123456789"
    }), Pl = Object.freeze(Object.defineProperty({
        __proto__: null,
        base10: Cl
    }, Symbol.toStringTag, {
        value: "Module"
    })), jl = ie({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4
    }), Rl = ie({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4
    }), zl = Object.freeze(Object.defineProperty({
        __proto__: null,
        base16: jl,
        base16upper: Rl
    }, Symbol.toStringTag, {
        value: "Module"
    })), kl = ie({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5
    }), Ml = ie({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5
    }), Hl = ie({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5
    }), Fl = ie({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5
    }), Dl = ie({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5
    }), ql = ie({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5
    }), Vl = ie({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5
    }), Kl = ie({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5
    }), $l = ie({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5
    }), Yl = Object.freeze(Object.defineProperty({
        __proto__: null,
        base32: kl,
        base32hex: Dl,
        base32hexpad: Vl,
        base32hexpadupper: Kl,
        base32hexupper: ql,
        base32pad: Hl,
        base32padupper: Fl,
        base32upper: Ml,
        base32z: $l
    }, Symbol.toStringTag, {
        value: "Module"
    })), Gl = Tt({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
    }), Wl = Tt({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }), Zl = Object.freeze(Object.defineProperty({
        __proto__: null,
        base36: Gl,
        base36upper: Wl
    }, Symbol.toStringTag, {
        value: "Module"
    })), Jl = Tt({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    }), Ql = Tt({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    }), Xl = Object.freeze(Object.defineProperty({
        __proto__: null,
        base58btc: Jl,
        base58flickr: Ql
    }, Symbol.toStringTag, {
        value: "Module"
    })), eu = ie({
        prefix: "m",
        name: "base64",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6
    }), tu = ie({
        prefix: "M",
        name: "base64pad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6
    }), ru = ie({
        prefix: "u",
        name: "base64url",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6
    }), nu = ie({
        prefix: "U",
        name: "base64urlpad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6
    }), ou = Object.freeze(Object.defineProperty({
        __proto__: null,
        base64: eu,
        base64pad: tu,
        base64url: ru,
        base64urlpad: nu
    }, Symbol.toStringTag, {
        value: "Module"
    })), ti = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), iu = ti.reduce((e, t, r)=>(e[r] = t, e), []), su = ti.reduce((e, t, r)=>(e[t.codePointAt(0)] = r, e), []);
    function fu(e) {
        return e.reduce((t, r)=>(t += iu[r], t), "");
    }
    function au(e) {
        const t = [];
        for (const r of e){
            const n = su[r.codePointAt(0)];
            if (n === void 0) throw new Error(`Non-base256emoji character: ${r}`);
            t.push(n);
        }
        return new Uint8Array(t);
    }
    const cu = tr({
        prefix: "🚀",
        name: "base256emoji",
        encode: fu,
        decode: au
    }), lu = Object.freeze(Object.defineProperty({
        __proto__: null,
        base256emoji: cu
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    new TextEncoder;
    new TextDecoder;
    ({
        ...Ul,
        ...Il,
        ...Tl,
        ...Pl,
        ...zl,
        ...Yl,
        ...Zl,
        ...Xl,
        ...ou,
        ...lu
    });
    const Dt = BigInt(2 ** 32 - 1), $n = BigInt(32);
    function ri(e, t = !1) {
        return t ? {
            h: Number(e & Dt),
            l: Number(e >> $n & Dt)
        } : {
            h: Number(e >> $n & Dt) | 0,
            l: Number(e & Dt) | 0
        };
    }
    function ni(e, t = !1) {
        const r = e.length;
        let n = new Uint32Array(r), i = new Uint32Array(r);
        for(let o = 0; o < r; o++){
            const { h: s, l: f } = ri(e[o], t);
            [n[o], i[o]] = [
                s,
                f
            ];
        }
        return [
            n,
            i
        ];
    }
    const Yn = (e, t, r)=>e >>> r, Gn = (e, t, r)=>e << 32 - r | t >>> r, De = (e, t, r)=>e >>> r | t << 32 - r, qe = (e, t, r)=>e << 32 - r | t >>> r, vt = (e, t, r)=>e << 64 - r | t >>> r - 32, xt = (e, t, r)=>e >>> r - 32 | t << 64 - r, uu = (e, t)=>t, hu = (e, t)=>e, du = (e, t, r)=>e << r | t >>> 32 - r, pu = (e, t, r)=>t << r | e >>> 32 - r, bu = (e, t, r)=>t << r - 32 | e >>> 64 - r, gu = (e, t, r)=>e << r - 32 | t >>> 64 - r;
    function ve(e, t, r, n) {
        const i = (t >>> 0) + (n >>> 0);
        return {
            h: e + r + (i / 2 ** 32 | 0) | 0,
            l: i | 0
        };
    }
    const Gr = (e, t, r)=>(e >>> 0) + (t >>> 0) + (r >>> 0), Wr = (e, t, r, n)=>t + r + n + (e / 2 ** 32 | 0) | 0, yu = (e, t, r, n)=>(e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0), wu = (e, t, r, n, i)=>t + r + n + i + (e / 2 ** 32 | 0) | 0, mu = (e, t, r, n, i)=>(e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0), vu = (e, t, r, n, i, o)=>t + r + n + i + o + (e / 2 ** 32 | 0) | 0, ft = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    function Zr(e) {
        return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
    }
    function $e(e) {
        if (!Number.isSafeInteger(e) || e < 0) throw new Error("positive integer expected, got " + e);
    }
    function ye(e, ...t) {
        if (!Zr(e)) throw new Error("Uint8Array expected");
        if (t.length > 0 && !t.includes(e.length)) throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
    }
    function xu(e) {
        if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
        $e(e.outputLen), $e(e.blockLen);
    }
    function Ye(e, t = !0) {
        if (e.destroyed) throw new Error("Hash instance has been destroyed");
        if (t && e.finished) throw new Error("Hash#digest() has already been called");
    }
    function Jr(e, t) {
        ye(e);
        const r = t.outputLen;
        if (e.length < r) throw new Error("digestInto() expects output buffer of length at least " + r);
    }
    function Ut(e) {
        return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
    }
    function xe(...e) {
        for(let t = 0; t < e.length; t++)e[t].fill(0);
    }
    function gr(e) {
        return new DataView(e.buffer, e.byteOffset, e.byteLength);
    }
    function Ae(e, t) {
        return e << 32 - t | e >>> t;
    }
    const oi = new Uint8Array(new Uint32Array([
        287454020
    ]).buffer)[0] === 68;
    function ii(e) {
        return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
    }
    const Ne = oi ? (e)=>e : (e)=>ii(e);
    function Eu(e) {
        for(let t = 0; t < e.length; t++)e[t] = ii(e[t]);
        return e;
    }
    const Ve = oi ? (e)=>e : Eu, si = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Au = Array.from({
        length: 256
    }, (e, t)=>t.toString(16).padStart(2, "0"));
    function Nt(e) {
        if (ye(e), si) return e.toHex();
        let t = "";
        for(let r = 0; r < e.length; r++)t += Au[e[r]];
        return t;
    }
    const Se = {
        _0: 48,
        _9: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
    };
    function Wn(e) {
        if (e >= Se._0 && e <= Se._9) return e - Se._0;
        if (e >= Se.A && e <= Se.F) return e - (Se.A - 10);
        if (e >= Se.a && e <= Se.f) return e - (Se.a - 10);
    }
    function Qr(e) {
        if (typeof e != "string") throw new Error("hex string expected, got " + typeof e);
        if (si) return Uint8Array.fromHex(e);
        const t = e.length, r = t / 2;
        if (t % 2) throw new Error("hex string expected, got unpadded hex of length " + t);
        const n = new Uint8Array(r);
        for(let i = 0, o = 0; i < r; i++, o += 2){
            const s = Wn(e.charCodeAt(o)), f = Wn(e.charCodeAt(o + 1));
            if (s === void 0 || f === void 0) {
                const c = e[o] + e[o + 1];
                throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
            }
            n[i] = s * 16 + f;
        }
        return n;
    }
    function _u(e) {
        if (typeof e != "string") throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(e));
    }
    function Te(e) {
        return typeof e == "string" && (e = _u(e)), ye(e), e;
    }
    function Je(...e) {
        let t = 0;
        for(let n = 0; n < e.length; n++){
            const i = e[n];
            ye(i), t += i.length;
        }
        const r = new Uint8Array(t);
        for(let n = 0, i = 0; n < e.length; n++){
            const o = e[n];
            r.set(o, i), i += o.length;
        }
        return r;
    }
    class rr {
    }
    function Ct(e) {
        const t = (n)=>e().update(Te(n)).digest(), r = e();
        return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = ()=>e(), t;
    }
    function Ou(e) {
        const t = (n, i)=>e(i).update(Te(n)).digest(), r = e({});
        return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = (n)=>e(n), t;
    }
    function fi(e = 32) {
        if (ft && typeof ft.getRandomValues == "function") return ft.getRandomValues(new Uint8Array(e));
        if (ft && typeof ft.randomBytes == "function") return Uint8Array.from(ft.randomBytes(e));
        throw new Error("crypto.getRandomValues must be defined");
    }
    const Su = BigInt(0), wt = BigInt(1), Bu = BigInt(2), Uu = BigInt(7), Nu = BigInt(256), Iu = BigInt(113), ai = [], ci = [], li = [];
    for(let e = 0, t = wt, r = 1, n = 0; e < 24; e++){
        [r, n] = [
            n,
            (2 * r + 3 * n) % 5
        ], ai.push(2 * (5 * n + r)), ci.push((e + 1) * (e + 2) / 2 % 64);
        let i = Su;
        for(let o = 0; o < 7; o++)t = (t << wt ^ (t >> Uu) * Iu) % Nu, t & Bu && (i ^= wt << (wt << BigInt(o)) - wt);
        li.push(i);
    }
    const ui = ni(li, !0), Lu = ui[0], Tu = ui[1], Zn = (e, t, r)=>r > 32 ? bu(e, t, r) : du(e, t, r), Jn = (e, t, r)=>r > 32 ? gu(e, t, r) : pu(e, t, r);
    function Cu(e, t = 24) {
        const r = new Uint32Array(10);
        for(let n = 24 - t; n < 24; n++){
            for(let s = 0; s < 10; s++)r[s] = e[s] ^ e[s + 10] ^ e[s + 20] ^ e[s + 30] ^ e[s + 40];
            for(let s = 0; s < 10; s += 2){
                const f = (s + 8) % 10, c = (s + 2) % 10, l = r[c], a = r[c + 1], u = Zn(l, a, 1) ^ r[f], d = Jn(l, a, 1) ^ r[f + 1];
                for(let p = 0; p < 50; p += 10)e[s + p] ^= u, e[s + p + 1] ^= d;
            }
            let i = e[2], o = e[3];
            for(let s = 0; s < 24; s++){
                const f = ci[s], c = Zn(i, o, f), l = Jn(i, o, f), a = ai[s];
                i = e[a], o = e[a + 1], e[a] = c, e[a + 1] = l;
            }
            for(let s = 0; s < 50; s += 10){
                for(let f = 0; f < 10; f++)r[f] = e[s + f];
                for(let f = 0; f < 10; f++)e[s + f] ^= ~r[(f + 2) % 10] & r[(f + 4) % 10];
            }
            e[0] ^= Lu[n], e[1] ^= Tu[n];
        }
        xe(r);
    }
    let Pu = class hi extends rr {
        constructor(t, r, n, i = !1, o = 24){
            if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = t, this.suffix = r, this.outputLen = n, this.enableXOF = i, this.rounds = o, $e(n), !(0 < t && t < 200)) throw new Error("only keccak-f1600 function is supported");
            this.state = new Uint8Array(200), this.state32 = Ut(this.state);
        }
        clone() {
            return this._cloneInto();
        }
        keccak() {
            Ve(this.state32), Cu(this.state32, this.rounds), Ve(this.state32), this.posOut = 0, this.pos = 0;
        }
        update(t) {
            Ye(this), t = Te(t), ye(t);
            const { blockLen: r, state: n } = this, i = t.length;
            for(let o = 0; o < i;){
                const s = Math.min(r - this.pos, i - o);
                for(let f = 0; f < s; f++)n[this.pos++] ^= t[o++];
                this.pos === r && this.keccak();
            }
            return this;
        }
        finish() {
            if (this.finished) return;
            this.finished = !0;
            const { state: t, suffix: r, pos: n, blockLen: i } = this;
            t[n] ^= r, r & 128 && n === i - 1 && this.keccak(), t[i - 1] ^= 128, this.keccak();
        }
        writeInto(t) {
            Ye(this, !1), ye(t), this.finish();
            const r = this.state, { blockLen: n } = this;
            for(let i = 0, o = t.length; i < o;){
                this.posOut >= n && this.keccak();
                const s = Math.min(n - this.posOut, o - i);
                t.set(r.subarray(this.posOut, this.posOut + s), i), this.posOut += s, i += s;
            }
            return t;
        }
        xofInto(t) {
            if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
            return this.writeInto(t);
        }
        xof(t) {
            return $e(t), this.xofInto(new Uint8Array(t));
        }
        digestInto(t) {
            if (Jr(t, this), this.finished) throw new Error("digest() was already called");
            return this.writeInto(t), this.destroy(), t;
        }
        digest() {
            return this.digestInto(new Uint8Array(this.outputLen));
        }
        destroy() {
            this.destroyed = !0, xe(this.state);
        }
        _cloneInto(t) {
            const { blockLen: r, suffix: n, outputLen: i, rounds: o, enableXOF: s } = this;
            return t || (t = new hi(r, n, i, s, o)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = o, t.suffix = n, t.outputLen = i, t.enableXOF = s, t.destroyed = this.destroyed, t;
        }
    };
    const ju = (e, t, r)=>Ct(()=>new Pu(t, e, r));
    ju(1, 136, 256 / 8);
    function Ru(e, t, r, n) {
        if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, r, n);
        const i = BigInt(32), o = BigInt(4294967295), s = Number(r >> i & o), f = Number(r & o), c = n ? 4 : 0, l = n ? 0 : 4;
        e.setUint32(t + c, s, n), e.setUint32(t + l, f, n);
    }
    function zu(e, t, r) {
        return e & t ^ ~e & r;
    }
    function ku(e, t, r) {
        return e & t ^ e & r ^ t & r;
    }
    let di = class extends rr {
        constructor(e, t, r, n){
            super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = n, this.buffer = new Uint8Array(e), this.view = gr(this.buffer);
        }
        update(e) {
            Ye(this), e = Te(e), ye(e);
            const { view: t, buffer: r, blockLen: n } = this, i = e.length;
            for(let o = 0; o < i;){
                const s = Math.min(n - this.pos, i - o);
                if (s === n) {
                    const f = gr(e);
                    for(; n <= i - o; o += n)this.process(f, o);
                    continue;
                }
                r.set(e.subarray(o, o + s), this.pos), this.pos += s, o += s, this.pos === n && (this.process(t, 0), this.pos = 0);
            }
            return this.length += e.length, this.roundClean(), this;
        }
        digestInto(e) {
            Ye(this), Jr(e, this), this.finished = !0;
            const { buffer: t, view: r, blockLen: n, isLE: i } = this;
            let { pos: o } = this;
            t[o++] = 128, xe(this.buffer.subarray(o)), this.padOffset > n - o && (this.process(r, 0), o = 0);
            for(let a = o; a < n; a++)t[a] = 0;
            Ru(r, n - 8, BigInt(this.length * 8), i), this.process(r, 0);
            const s = gr(e), f = this.outputLen;
            if (f % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const c = f / 4, l = this.get();
            if (c > l.length) throw new Error("_sha2: outputLen bigger than state");
            for(let a = 0; a < c; a++)s.setUint32(4 * a, l[a], i);
        }
        digest() {
            const { buffer: e, outputLen: t } = this;
            this.digestInto(e);
            const r = e.slice(0, t);
            return this.destroy(), r;
        }
        _cloneInto(e) {
            e || (e = new this.constructor), e.set(...this.get());
            const { blockLen: t, buffer: r, length: n, finished: i, destroyed: o, pos: s } = this;
            return e.destroyed = o, e.finished = i, e.length = n, e.pos = s, n % t && e.buffer.set(r), e;
        }
        clone() {
            return this._cloneInto();
        }
    };
    const Re = Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
    ]), fe = Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
    ]), ae = Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
    ]), Mu = Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
    ]), ze = new Uint32Array(64);
    let Hu = class extends di {
        constructor(e = 32){
            super(64, e, 8, !1), this.A = Re[0] | 0, this.B = Re[1] | 0, this.C = Re[2] | 0, this.D = Re[3] | 0, this.E = Re[4] | 0, this.F = Re[5] | 0, this.G = Re[6] | 0, this.H = Re[7] | 0;
        }
        get() {
            const { A: e, B: t, C: r, D: n, E: i, F: o, G: s, H: f } = this;
            return [
                e,
                t,
                r,
                n,
                i,
                o,
                s,
                f
            ];
        }
        set(e, t, r, n, i, o, s, f) {
            this.A = e | 0, this.B = t | 0, this.C = r | 0, this.D = n | 0, this.E = i | 0, this.F = o | 0, this.G = s | 0, this.H = f | 0;
        }
        process(e, t) {
            for(let a = 0; a < 16; a++, t += 4)ze[a] = e.getUint32(t, !1);
            for(let a = 16; a < 64; a++){
                const u = ze[a - 15], d = ze[a - 2], p = Ae(u, 7) ^ Ae(u, 18) ^ u >>> 3, h = Ae(d, 17) ^ Ae(d, 19) ^ d >>> 10;
                ze[a] = h + ze[a - 7] + p + ze[a - 16] | 0;
            }
            let { A: r, B: n, C: i, D: o, E: s, F: f, G: c, H: l } = this;
            for(let a = 0; a < 64; a++){
                const u = Ae(s, 6) ^ Ae(s, 11) ^ Ae(s, 25), d = l + u + zu(s, f, c) + Mu[a] + ze[a] | 0, p = (Ae(r, 2) ^ Ae(r, 13) ^ Ae(r, 22)) + ku(r, n, i) | 0;
                l = c, c = f, f = s, s = o + d | 0, o = i, i = n, n = r, r = d + p | 0;
            }
            r = r + this.A | 0, n = n + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, s = s + this.E | 0, f = f + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(r, n, i, o, s, f, c, l);
        }
        roundClean() {
            xe(ze);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), xe(this.buffer);
        }
    };
    const pi = ni([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
    ].map((e)=>BigInt(e))), Fu = pi[0], Du = pi[1], ke = new Uint32Array(80), Me = new Uint32Array(80);
    let Xr = class extends di {
        constructor(e = 64){
            super(128, e, 16, !1), this.Ah = ae[0] | 0, this.Al = ae[1] | 0, this.Bh = ae[2] | 0, this.Bl = ae[3] | 0, this.Ch = ae[4] | 0, this.Cl = ae[5] | 0, this.Dh = ae[6] | 0, this.Dl = ae[7] | 0, this.Eh = ae[8] | 0, this.El = ae[9] | 0, this.Fh = ae[10] | 0, this.Fl = ae[11] | 0, this.Gh = ae[12] | 0, this.Gl = ae[13] | 0, this.Hh = ae[14] | 0, this.Hl = ae[15] | 0;
        }
        get() {
            const { Ah: e, Al: t, Bh: r, Bl: n, Ch: i, Cl: o, Dh: s, Dl: f, Eh: c, El: l, Fh: a, Fl: u, Gh: d, Gl: p, Hh: h, Hl: b } = this;
            return [
                e,
                t,
                r,
                n,
                i,
                o,
                s,
                f,
                c,
                l,
                a,
                u,
                d,
                p,
                h,
                b
            ];
        }
        set(e, t, r, n, i, o, s, f, c, l, a, u, d, p, h, b) {
            this.Ah = e | 0, this.Al = t | 0, this.Bh = r | 0, this.Bl = n | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = s | 0, this.Dl = f | 0, this.Eh = c | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = u | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = h | 0, this.Hl = b | 0;
        }
        process(e, t) {
            for(let E = 0; E < 16; E++, t += 4)ke[E] = e.getUint32(t), Me[E] = e.getUint32(t += 4);
            for(let E = 16; E < 80; E++){
                const S = ke[E - 15] | 0, N = Me[E - 15] | 0, T = De(S, N, 1) ^ De(S, N, 8) ^ Yn(S, N, 7), M = qe(S, N, 1) ^ qe(S, N, 8) ^ Gn(S, N, 7), j = ke[E - 2] | 0, I = Me[E - 2] | 0, g = De(j, I, 19) ^ vt(j, I, 61) ^ Yn(j, I, 6), B = qe(j, I, 19) ^ xt(j, I, 61) ^ Gn(j, I, 6), w = yu(M, B, Me[E - 7], Me[E - 16]), A = wu(w, T, g, ke[E - 7], ke[E - 16]);
                ke[E] = A | 0, Me[E] = w | 0;
            }
            let { Ah: r, Al: n, Bh: i, Bl: o, Ch: s, Cl: f, Dh: c, Dl: l, Eh: a, El: u, Fh: d, Fl: p, Gh: h, Gl: b, Hh: m, Hl: L } = this;
            for(let E = 0; E < 80; E++){
                const S = De(a, u, 14) ^ De(a, u, 18) ^ vt(a, u, 41), N = qe(a, u, 14) ^ qe(a, u, 18) ^ xt(a, u, 41), T = a & d ^ ~a & h, M = u & p ^ ~u & b, j = mu(L, N, M, Du[E], Me[E]), I = vu(j, m, S, T, Fu[E], ke[E]), g = j | 0, B = De(r, n, 28) ^ vt(r, n, 34) ^ vt(r, n, 39), w = qe(r, n, 28) ^ xt(r, n, 34) ^ xt(r, n, 39), A = r & i ^ r & s ^ i & s, U = n & o ^ n & f ^ o & f;
                m = h | 0, L = b | 0, h = d | 0, b = p | 0, d = a | 0, p = u | 0, { h: a, l: u } = ve(c | 0, l | 0, I | 0, g | 0), c = s | 0, l = f | 0, s = i | 0, f = o | 0, i = r | 0, o = n | 0;
                const P = Gr(g, w, U);
                r = Wr(P, I, B, A), n = P | 0;
            }
            ({ h: r, l: n } = ve(this.Ah | 0, this.Al | 0, r | 0, n | 0)), { h: i, l: o } = ve(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: s, l: f } = ve(this.Ch | 0, this.Cl | 0, s | 0, f | 0), { h: c, l } = ve(this.Dh | 0, this.Dl | 0, c | 0, l | 0), { h: a, l: u } = ve(this.Eh | 0, this.El | 0, a | 0, u | 0), { h: d, l: p } = ve(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h, l: b } = ve(this.Gh | 0, this.Gl | 0, h | 0, b | 0), { h: m, l: L } = ve(this.Hh | 0, this.Hl | 0, m | 0, L | 0), this.set(r, n, i, o, s, f, c, l, a, u, d, p, h, b, m, L);
        }
        roundClean() {
            xe(ke, Me);
        }
        destroy() {
            xe(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }, qu = class extends Xr {
        constructor(){
            super(48), this.Ah = fe[0] | 0, this.Al = fe[1] | 0, this.Bh = fe[2] | 0, this.Bl = fe[3] | 0, this.Ch = fe[4] | 0, this.Cl = fe[5] | 0, this.Dh = fe[6] | 0, this.Dl = fe[7] | 0, this.Eh = fe[8] | 0, this.El = fe[9] | 0, this.Fh = fe[10] | 0, this.Fl = fe[11] | 0, this.Gh = fe[12] | 0, this.Gl = fe[13] | 0, this.Hh = fe[14] | 0, this.Hl = fe[15] | 0;
        }
    };
    const ce = Uint32Array.from([
        573645204,
        4230739756,
        2673172387,
        3360449730,
        596883563,
        1867755857,
        2520282905,
        1497426621,
        2519219938,
        2827943907,
        3193839141,
        1401305490,
        721525244,
        746961066,
        246885852,
        2177182882
    ]);
    class Vu extends Xr {
        constructor(){
            super(32), this.Ah = ce[0] | 0, this.Al = ce[1] | 0, this.Bh = ce[2] | 0, this.Bl = ce[3] | 0, this.Ch = ce[4] | 0, this.Cl = ce[5] | 0, this.Dh = ce[6] | 0, this.Dl = ce[7] | 0, this.Eh = ce[8] | 0, this.El = ce[9] | 0, this.Fh = ce[10] | 0, this.Fl = ce[11] | 0, this.Gh = ce[12] | 0, this.Gl = ce[13] | 0, this.Hh = ce[14] | 0, this.Hl = ce[15] | 0;
        }
    }
    const Ku = Ct(()=>new Hu), $u = Ct(()=>new Xr), Yu = Ct(()=>new qu);
    Ct(()=>new Vu);
    const Gu = Uint8Array.from([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        14,
        10,
        4,
        8,
        9,
        15,
        13,
        6,
        1,
        12,
        0,
        2,
        11,
        7,
        5,
        3,
        11,
        8,
        12,
        0,
        5,
        2,
        15,
        13,
        10,
        14,
        3,
        6,
        7,
        1,
        9,
        4,
        7,
        9,
        3,
        1,
        13,
        12,
        11,
        14,
        2,
        6,
        5,
        10,
        4,
        0,
        15,
        8,
        9,
        0,
        5,
        7,
        2,
        4,
        10,
        15,
        14,
        1,
        11,
        12,
        6,
        8,
        3,
        13,
        2,
        12,
        6,
        10,
        0,
        11,
        8,
        3,
        4,
        13,
        7,
        5,
        15,
        14,
        1,
        9,
        12,
        5,
        1,
        15,
        14,
        13,
        4,
        10,
        0,
        7,
        6,
        3,
        9,
        2,
        8,
        11,
        13,
        11,
        7,
        14,
        12,
        1,
        3,
        9,
        5,
        0,
        15,
        4,
        8,
        6,
        2,
        10,
        6,
        15,
        14,
        9,
        11,
        3,
        0,
        8,
        12,
        2,
        13,
        7,
        1,
        4,
        10,
        5,
        10,
        2,
        8,
        4,
        7,
        6,
        1,
        5,
        15,
        11,
        9,
        14,
        3,
        12,
        13,
        0,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        14,
        10,
        4,
        8,
        9,
        15,
        13,
        6,
        1,
        12,
        0,
        2,
        11,
        7,
        5,
        3,
        11,
        8,
        12,
        0,
        5,
        2,
        15,
        13,
        10,
        14,
        3,
        6,
        7,
        1,
        9,
        4,
        7,
        9,
        3,
        1,
        13,
        12,
        11,
        14,
        2,
        6,
        5,
        10,
        4,
        0,
        15,
        8,
        9,
        0,
        5,
        7,
        2,
        4,
        10,
        15,
        14,
        1,
        11,
        12,
        6,
        8,
        3,
        13,
        2,
        12,
        6,
        10,
        0,
        11,
        8,
        3,
        4,
        13,
        7,
        5,
        15,
        14,
        1,
        9
    ]), X = Uint32Array.from([
        4089235720,
        1779033703,
        2227873595,
        3144134277,
        4271175723,
        1013904242,
        1595750129,
        2773480762,
        2917565137,
        1359893119,
        725511199,
        2600822924,
        4215389547,
        528734635,
        327033209,
        1541459225
    ]), z = new Uint32Array(32);
    function He(e, t, r, n, i, o) {
        const s = i[o], f = i[o + 1];
        let c = z[2 * e], l = z[2 * e + 1], a = z[2 * t], u = z[2 * t + 1], d = z[2 * r], p = z[2 * r + 1], h = z[2 * n], b = z[2 * n + 1], m = Gr(c, a, s);
        l = Wr(m, l, u, f), c = m | 0, { Dh: b, Dl: h } = {
            Dh: b ^ l,
            Dl: h ^ c
        }, { Dh: b, Dl: h } = {
            Dh: uu(b, h),
            Dl: hu(b)
        }, { h: p, l: d } = ve(p, d, b, h), { Bh: u, Bl: a } = {
            Bh: u ^ p,
            Bl: a ^ d
        }, { Bh: u, Bl: a } = {
            Bh: De(u, a, 24),
            Bl: qe(u, a, 24)
        }, z[2 * e] = c, z[2 * e + 1] = l, z[2 * t] = a, z[2 * t + 1] = u, z[2 * r] = d, z[2 * r + 1] = p, z[2 * n] = h, z[2 * n + 1] = b;
    }
    function Fe(e, t, r, n, i, o) {
        const s = i[o], f = i[o + 1];
        let c = z[2 * e], l = z[2 * e + 1], a = z[2 * t], u = z[2 * t + 1], d = z[2 * r], p = z[2 * r + 1], h = z[2 * n], b = z[2 * n + 1], m = Gr(c, a, s);
        l = Wr(m, l, u, f), c = m | 0, { Dh: b, Dl: h } = {
            Dh: b ^ l,
            Dl: h ^ c
        }, { Dh: b, Dl: h } = {
            Dh: De(b, h, 16),
            Dl: qe(b, h, 16)
        }, { h: p, l: d } = ve(p, d, b, h), { Bh: u, Bl: a } = {
            Bh: u ^ p,
            Bl: a ^ d
        }, { Bh: u, Bl: a } = {
            Bh: vt(u, a, 63),
            Bl: xt(u, a, 63)
        }, z[2 * e] = c, z[2 * e + 1] = l, z[2 * t] = a, z[2 * t + 1] = u, z[2 * r] = d, z[2 * r + 1] = p, z[2 * n] = h, z[2 * n + 1] = b;
    }
    function Wu(e, t = {}, r, n, i) {
        if ($e(r), e < 0 || e > r) throw new Error("outputLen bigger than keyLen");
        const { key: o, salt: s, personalization: f } = t;
        if (o !== void 0 && (o.length < 1 || o.length > r)) throw new Error("key length must be undefined or 1.." + r);
        if (s !== void 0 && s.length !== n) throw new Error("salt must be undefined or " + n);
        if (f !== void 0 && f.length !== i) throw new Error("personalization must be undefined or " + i);
    }
    class Zu extends rr {
        constructor(t, r){
            super(), this.finished = !1, this.destroyed = !1, this.length = 0, this.pos = 0, $e(t), $e(r), this.blockLen = t, this.outputLen = r, this.buffer = new Uint8Array(t), this.buffer32 = Ut(this.buffer);
        }
        update(t) {
            Ye(this), t = Te(t), ye(t);
            const { blockLen: r, buffer: n, buffer32: i } = this, o = t.length, s = t.byteOffset, f = t.buffer;
            for(let c = 0; c < o;){
                this.pos === r && (Ve(i), this.compress(i, 0, !1), Ve(i), this.pos = 0);
                const l = Math.min(r - this.pos, o - c), a = s + c;
                if (l === r && !(a % 4) && c + l < o) {
                    const u = new Uint32Array(f, a, Math.floor((o - c) / 4));
                    Ve(u);
                    for(let d = 0; c + r < o; d += i.length, c += r)this.length += r, this.compress(u, d, !1);
                    Ve(u);
                    continue;
                }
                n.set(t.subarray(c, c + l), this.pos), this.pos += l, this.length += l, c += l;
            }
            return this;
        }
        digestInto(t) {
            Ye(this), Jr(t, this);
            const { pos: r, buffer32: n } = this;
            this.finished = !0, xe(this.buffer.subarray(r)), Ve(n), this.compress(n, 0, !0), Ve(n);
            const i = Ut(t);
            this.get().forEach((o, s)=>i[s] = Ne(o));
        }
        digest() {
            const { buffer: t, outputLen: r } = this;
            this.digestInto(t);
            const n = t.slice(0, r);
            return this.destroy(), n;
        }
        _cloneInto(t) {
            const { buffer: r, length: n, finished: i, destroyed: o, outputLen: s, pos: f } = this;
            return t || (t = new this.constructor({
                dkLen: s
            })), t.set(...this.get()), t.buffer.set(r), t.destroyed = o, t.finished = i, t.length = n, t.pos = f, t.outputLen = s, t;
        }
        clone() {
            return this._cloneInto();
        }
    }
    class Ju extends Zu {
        constructor(t = {}){
            const r = t.dkLen === void 0 ? 64 : t.dkLen;
            super(128, r), this.v0l = X[0] | 0, this.v0h = X[1] | 0, this.v1l = X[2] | 0, this.v1h = X[3] | 0, this.v2l = X[4] | 0, this.v2h = X[5] | 0, this.v3l = X[6] | 0, this.v3h = X[7] | 0, this.v4l = X[8] | 0, this.v4h = X[9] | 0, this.v5l = X[10] | 0, this.v5h = X[11] | 0, this.v6l = X[12] | 0, this.v6h = X[13] | 0, this.v7l = X[14] | 0, this.v7h = X[15] | 0, Wu(r, t, 64, 16, 16);
            let { key: n, personalization: i, salt: o } = t, s = 0;
            if (n !== void 0 && (n = Te(n), s = n.length), this.v0l ^= this.outputLen | s << 8 | 65536 | 1 << 24, o !== void 0) {
                o = Te(o);
                const f = Ut(o);
                this.v4l ^= Ne(f[0]), this.v4h ^= Ne(f[1]), this.v5l ^= Ne(f[2]), this.v5h ^= Ne(f[3]);
            }
            if (i !== void 0) {
                i = Te(i);
                const f = Ut(i);
                this.v6l ^= Ne(f[0]), this.v6h ^= Ne(f[1]), this.v7l ^= Ne(f[2]), this.v7h ^= Ne(f[3]);
            }
            if (n !== void 0) {
                const f = new Uint8Array(this.blockLen);
                f.set(n), this.update(f);
            }
        }
        get() {
            let { v0l: t, v0h: r, v1l: n, v1h: i, v2l: o, v2h: s, v3l: f, v3h: c, v4l: l, v4h: a, v5l: u, v5h: d, v6l: p, v6h: h, v7l: b, v7h: m } = this;
            return [
                t,
                r,
                n,
                i,
                o,
                s,
                f,
                c,
                l,
                a,
                u,
                d,
                p,
                h,
                b,
                m
            ];
        }
        set(t, r, n, i, o, s, f, c, l, a, u, d, p, h, b, m) {
            this.v0l = t | 0, this.v0h = r | 0, this.v1l = n | 0, this.v1h = i | 0, this.v2l = o | 0, this.v2h = s | 0, this.v3l = f | 0, this.v3h = c | 0, this.v4l = l | 0, this.v4h = a | 0, this.v5l = u | 0, this.v5h = d | 0, this.v6l = p | 0, this.v6h = h | 0, this.v7l = b | 0, this.v7h = m | 0;
        }
        compress(t, r, n) {
            this.get().forEach((c, l)=>z[l] = c), z.set(X, 16);
            let { h: i, l: o } = ri(BigInt(this.length));
            z[24] = X[8] ^ o, z[25] = X[9] ^ i, n && (z[28] = ~z[28], z[29] = ~z[29]);
            let s = 0;
            const f = Gu;
            for(let c = 0; c < 12; c++)He(0, 4, 8, 12, t, r + 2 * f[s++]), Fe(0, 4, 8, 12, t, r + 2 * f[s++]), He(1, 5, 9, 13, t, r + 2 * f[s++]), Fe(1, 5, 9, 13, t, r + 2 * f[s++]), He(2, 6, 10, 14, t, r + 2 * f[s++]), Fe(2, 6, 10, 14, t, r + 2 * f[s++]), He(3, 7, 11, 15, t, r + 2 * f[s++]), Fe(3, 7, 11, 15, t, r + 2 * f[s++]), He(0, 5, 10, 15, t, r + 2 * f[s++]), Fe(0, 5, 10, 15, t, r + 2 * f[s++]), He(1, 6, 11, 12, t, r + 2 * f[s++]), Fe(1, 6, 11, 12, t, r + 2 * f[s++]), He(2, 7, 8, 13, t, r + 2 * f[s++]), Fe(2, 7, 8, 13, t, r + 2 * f[s++]), He(3, 4, 9, 14, t, r + 2 * f[s++]), Fe(3, 4, 9, 14, t, r + 2 * f[s++]);
            this.v0l ^= z[0] ^ z[16], this.v0h ^= z[1] ^ z[17], this.v1l ^= z[2] ^ z[18], this.v1h ^= z[3] ^ z[19], this.v2l ^= z[4] ^ z[20], this.v2h ^= z[5] ^ z[21], this.v3l ^= z[6] ^ z[22], this.v3h ^= z[7] ^ z[23], this.v4l ^= z[8] ^ z[24], this.v4h ^= z[9] ^ z[25], this.v5l ^= z[10] ^ z[26], this.v5h ^= z[11] ^ z[27], this.v6l ^= z[12] ^ z[28], this.v6h ^= z[13] ^ z[29], this.v7l ^= z[14] ^ z[30], this.v7h ^= z[15] ^ z[31], xe(z);
        }
        destroy() {
            this.destroyed = !0, xe(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }
    Ou((e)=>new Ju(e));
    function bi(e) {
        return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
    }
    function Tr(e) {
        if (typeof e != "boolean") throw new Error(`boolean expected, not ${e}`);
    }
    function yr(e) {
        if (!Number.isSafeInteger(e) || e < 0) throw new Error("positive integer expected, got " + e);
    }
    function de(e, ...t) {
        if (!bi(e)) throw new Error("Uint8Array expected");
        if (t.length > 0 && !t.includes(e.length)) throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
    }
    function Qn(e, t = !0) {
        if (e.destroyed) throw new Error("Hash instance has been destroyed");
        if (t && e.finished) throw new Error("Hash#digest() has already been called");
    }
    function Qu(e, t) {
        de(e);
        const r = t.outputLen;
        if (e.length < r) throw new Error("digestInto() expects output buffer of length at least " + r);
    }
    function Ke(e) {
        return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
    }
    function lt(...e) {
        for(let t = 0; t < e.length; t++)e[t].fill(0);
    }
    function Xu(e) {
        return new DataView(e.buffer, e.byteOffset, e.byteLength);
    }
    const eh = new Uint8Array(new Uint32Array([
        287454020
    ]).buffer)[0] === 68;
    function th(e) {
        if (typeof e != "string") throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(e));
    }
    function Cr(e) {
        if (typeof e == "string") e = th(e);
        else if (bi(e)) e = Pr(e);
        else throw new Error("Uint8Array expected, got " + typeof e);
        return e;
    }
    function rh(e, t) {
        if (t == null || typeof t != "object") throw new Error("options must be defined");
        return Object.assign(e, t);
    }
    function nh(e, t) {
        if (e.length !== t.length) return !1;
        let r = 0;
        for(let n = 0; n < e.length; n++)r |= e[n] ^ t[n];
        return r === 0;
    }
    const oh = (e, t)=>{
        function r(n, ...i) {
            if (de(n), !eh) throw new Error("Non little-endian hardware is not yet supported");
            if (e.nonceLength !== void 0) {
                const l = i[0];
                if (!l) throw new Error("nonce / iv required");
                e.varSizeNonce ? de(l) : de(l, e.nonceLength);
            }
            const o = e.tagLength;
            o && i[1] !== void 0 && de(i[1]);
            const s = t(n, ...i), f = (l, a)=>{
                if (a !== void 0) {
                    if (l !== 2) throw new Error("cipher output not supported");
                    de(a);
                }
            };
            let c = !1;
            return {
                encrypt (l, a) {
                    if (c) throw new Error("cannot encrypt() twice with same key + nonce");
                    return c = !0, de(l), f(s.encrypt.length, a), s.encrypt(l, a);
                },
                decrypt (l, a) {
                    if (de(l), o && l.length < o) throw new Error("invalid ciphertext length: smaller than tagLength=" + o);
                    return f(s.decrypt.length, a), s.decrypt(l, a);
                }
            };
        }
        return Object.assign(r, e), r;
    };
    function Xn(e, t, r = !0) {
        if (t === void 0) return new Uint8Array(e);
        if (t.length !== e) throw new Error("invalid output length, expected " + e + ", got: " + t.length);
        if (r && !sh(t)) throw new Error("invalid output, must be aligned");
        return t;
    }
    function eo(e, t, r, n) {
        if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, r, n);
        const i = BigInt(32), o = BigInt(4294967295), s = Number(r >> i & o), f = Number(r & o);
        e.setUint32(t + 4, s, n), e.setUint32(t + 0, f, n);
    }
    function ih(e, t, r) {
        Tr(r);
        const n = new Uint8Array(16), i = Xu(n);
        return eo(i, 0, BigInt(t), r), eo(i, 8, BigInt(e), r), n;
    }
    function sh(e) {
        return e.byteOffset % 4 === 0;
    }
    function Pr(e) {
        return Uint8Array.from(e);
    }
    const gi = (e)=>Uint8Array.from(e.split("").map((t)=>t.charCodeAt(0))), fh = gi("expand 16-byte k"), ah = gi("expand 32-byte k"), ch = Ke(fh), lh = Ke(ah);
    function $(e, t) {
        return e << t | e >>> 32 - t;
    }
    function jr(e) {
        return e.byteOffset % 4 === 0;
    }
    const qt = 64, uh = 16, yi = 2 ** 32 - 1, to = new Uint32Array;
    function hh(e, t, r, n, i, o, s, f) {
        const c = i.length, l = new Uint8Array(qt), a = Ke(l), u = jr(i) && jr(o), d = u ? Ke(i) : to, p = u ? Ke(o) : to;
        for(let h = 0; h < c; s++){
            if (e(t, r, n, a, s, f), s >= yi) throw new Error("arx: counter overflow");
            const b = Math.min(qt, c - h);
            if (u && b === qt) {
                const m = h / 4;
                if (h % 4 !== 0) throw new Error("arx: invalid block position");
                for(let L = 0, E; L < uh; L++)E = m + L, p[E] = d[E] ^ a[L];
                h += qt;
                continue;
            }
            for(let m = 0, L; m < b; m++)L = h + m, o[L] = i[L] ^ l[m];
            h += b;
        }
    }
    function dh(e, t) {
        const { allowShortKeys: r, extendNonceFn: n, counterLength: i, counterRight: o, rounds: s } = rh({
            allowShortKeys: !1,
            counterLength: 8,
            counterRight: !1,
            rounds: 20
        }, t);
        if (typeof e != "function") throw new Error("core must be a function");
        return yr(i), yr(s), Tr(o), Tr(r), (f, c, l, a, u = 0)=>{
            de(f), de(c), de(l);
            const d = l.length;
            if (a === void 0 && (a = new Uint8Array(d)), de(a), yr(u), u < 0 || u >= yi) throw new Error("arx: counter overflow");
            if (a.length < d) throw new Error(`arx: output (${a.length}) is shorter than data (${d})`);
            const p = [];
            let h = f.length, b, m;
            if (h === 32) p.push(b = Pr(f)), m = lh;
            else if (h === 16 && r) b = new Uint8Array(32), b.set(f), b.set(f, 16), m = ch, p.push(b);
            else throw new Error(`arx: invalid 32-byte key, got length=${h}`);
            jr(c) || p.push(c = Pr(c));
            const L = Ke(b);
            if (n) {
                if (c.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
                n(m, L, Ke(c.subarray(0, 16)), L), c = c.subarray(16);
            }
            const E = 16 - i;
            if (E !== c.length) throw new Error(`arx: nonce must be ${E} or 16 bytes`);
            if (E !== 12) {
                const N = new Uint8Array(12);
                N.set(c, o ? 0 : 12 - c.length), c = N, p.push(c);
            }
            const S = Ke(c);
            return hh(e, m, L, S, l, a, u, s), lt(...p), a;
        };
    }
    const ne = (e, t)=>e[t++] & 255 | (e[t++] & 255) << 8;
    class ph {
        constructor(t){
            this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, t = Cr(t), de(t, 32);
            const r = ne(t, 0), n = ne(t, 2), i = ne(t, 4), o = ne(t, 6), s = ne(t, 8), f = ne(t, 10), c = ne(t, 12), l = ne(t, 14);
            this.r[0] = r & 8191, this.r[1] = (r >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | i << 6) & 7939, this.r[3] = (i >>> 7 | o << 9) & 8191, this.r[4] = (o >>> 4 | s << 12) & 255, this.r[5] = s >>> 1 & 8190, this.r[6] = (s >>> 14 | f << 2) & 8191, this.r[7] = (f >>> 11 | c << 5) & 8065, this.r[8] = (c >>> 8 | l << 8) & 8191, this.r[9] = l >>> 5 & 127;
            for(let a = 0; a < 8; a++)this.pad[a] = ne(t, 16 + 2 * a);
        }
        process(t, r, n = !1) {
            const i = n ? 0 : 2048, { h: o, r: s } = this, f = s[0], c = s[1], l = s[2], a = s[3], u = s[4], d = s[5], p = s[6], h = s[7], b = s[8], m = s[9], L = ne(t, r + 0), E = ne(t, r + 2), S = ne(t, r + 4), N = ne(t, r + 6), T = ne(t, r + 8), M = ne(t, r + 10), j = ne(t, r + 12), I = ne(t, r + 14);
            let g = o[0] + (L & 8191), B = o[1] + ((L >>> 13 | E << 3) & 8191), w = o[2] + ((E >>> 10 | S << 6) & 8191), A = o[3] + ((S >>> 7 | N << 9) & 8191), U = o[4] + ((N >>> 4 | T << 12) & 8191), P = o[5] + (T >>> 1 & 8191), x = o[6] + ((T >>> 14 | M << 2) & 8191), y = o[7] + ((M >>> 11 | j << 5) & 8191), v = o[8] + ((j >>> 8 | I << 8) & 8191), _ = o[9] + (I >>> 5 | i), O = 0, R = O + g * f + B * (5 * m) + w * (5 * b) + A * (5 * h) + U * (5 * p);
            O = R >>> 13, R &= 8191, R += P * (5 * d) + x * (5 * u) + y * (5 * a) + v * (5 * l) + _ * (5 * c), O += R >>> 13, R &= 8191;
            let C = O + g * c + B * f + w * (5 * m) + A * (5 * b) + U * (5 * h);
            O = C >>> 13, C &= 8191, C += P * (5 * p) + x * (5 * d) + y * (5 * u) + v * (5 * a) + _ * (5 * l), O += C >>> 13, C &= 8191;
            let k = O + g * l + B * c + w * f + A * (5 * m) + U * (5 * b);
            O = k >>> 13, k &= 8191, k += P * (5 * h) + x * (5 * p) + y * (5 * d) + v * (5 * u) + _ * (5 * a), O += k >>> 13, k &= 8191;
            let H = O + g * a + B * l + w * c + A * f + U * (5 * m);
            O = H >>> 13, H &= 8191, H += P * (5 * b) + x * (5 * h) + y * (5 * p) + v * (5 * d) + _ * (5 * u), O += H >>> 13, H &= 8191;
            let F = O + g * u + B * a + w * l + A * c + U * f;
            O = F >>> 13, F &= 8191, F += P * (5 * m) + x * (5 * b) + y * (5 * h) + v * (5 * p) + _ * (5 * d), O += F >>> 13, F &= 8191;
            let D = O + g * d + B * u + w * a + A * l + U * c;
            O = D >>> 13, D &= 8191, D += P * f + x * (5 * m) + y * (5 * b) + v * (5 * h) + _ * (5 * p), O += D >>> 13, D &= 8191;
            let V = O + g * p + B * d + w * u + A * a + U * l;
            O = V >>> 13, V &= 8191, V += P * c + x * f + y * (5 * m) + v * (5 * b) + _ * (5 * h), O += V >>> 13, V &= 8191;
            let J = O + g * h + B * p + w * d + A * u + U * a;
            O = J >>> 13, J &= 8191, J += P * l + x * c + y * f + v * (5 * m) + _ * (5 * b), O += J >>> 13, J &= 8191;
            let W = O + g * b + B * h + w * p + A * d + U * u;
            O = W >>> 13, W &= 8191, W += P * a + x * l + y * c + v * f + _ * (5 * m), O += W >>> 13, W &= 8191;
            let Y = O + g * m + B * b + w * h + A * p + U * d;
            O = Y >>> 13, Y &= 8191, Y += P * u + x * a + y * l + v * c + _ * f, O += Y >>> 13, Y &= 8191, O = (O << 2) + O | 0, O = O + R | 0, R = O & 8191, O = O >>> 13, C += O, o[0] = R, o[1] = C, o[2] = k, o[3] = H, o[4] = F, o[5] = D, o[6] = V, o[7] = J, o[8] = W, o[9] = Y;
        }
        finalize() {
            const { h: t, pad: r } = this, n = new Uint16Array(10);
            let i = t[1] >>> 13;
            t[1] &= 8191;
            for(let f = 2; f < 10; f++)t[f] += i, i = t[f] >>> 13, t[f] &= 8191;
            t[0] += i * 5, i = t[0] >>> 13, t[0] &= 8191, t[1] += i, i = t[1] >>> 13, t[1] &= 8191, t[2] += i, n[0] = t[0] + 5, i = n[0] >>> 13, n[0] &= 8191;
            for(let f = 1; f < 10; f++)n[f] = t[f] + i, i = n[f] >>> 13, n[f] &= 8191;
            n[9] -= 8192;
            let o = (i ^ 1) - 1;
            for(let f = 0; f < 10; f++)n[f] &= o;
            o = ~o;
            for(let f = 0; f < 10; f++)t[f] = t[f] & o | n[f];
            t[0] = (t[0] | t[1] << 13) & 65535, t[1] = (t[1] >>> 3 | t[2] << 10) & 65535, t[2] = (t[2] >>> 6 | t[3] << 7) & 65535, t[3] = (t[3] >>> 9 | t[4] << 4) & 65535, t[4] = (t[4] >>> 12 | t[5] << 1 | t[6] << 14) & 65535, t[5] = (t[6] >>> 2 | t[7] << 11) & 65535, t[6] = (t[7] >>> 5 | t[8] << 8) & 65535, t[7] = (t[8] >>> 8 | t[9] << 5) & 65535;
            let s = t[0] + r[0];
            t[0] = s & 65535;
            for(let f = 1; f < 8; f++)s = (t[f] + r[f] | 0) + (s >>> 16) | 0, t[f] = s & 65535;
            lt(n);
        }
        update(t) {
            Qn(this), t = Cr(t), de(t);
            const { buffer: r, blockLen: n } = this, i = t.length;
            for(let o = 0; o < i;){
                const s = Math.min(n - this.pos, i - o);
                if (s === n) {
                    for(; n <= i - o; o += n)this.process(t, o);
                    continue;
                }
                r.set(t.subarray(o, o + s), this.pos), this.pos += s, o += s, this.pos === n && (this.process(r, 0, !1), this.pos = 0);
            }
            return this;
        }
        destroy() {
            lt(this.h, this.r, this.buffer, this.pad);
        }
        digestInto(t) {
            Qn(this), Qu(t, this), this.finished = !0;
            const { buffer: r, h: n } = this;
            let { pos: i } = this;
            if (i) {
                for(r[i++] = 1; i < 16; i++)r[i] = 0;
                this.process(r, 0, !0);
            }
            this.finalize();
            let o = 0;
            for(let s = 0; s < 8; s++)t[o++] = n[s] >>> 0, t[o++] = n[s] >>> 8;
            return t;
        }
        digest() {
            const { buffer: t, outputLen: r } = this;
            this.digestInto(t);
            const n = t.slice(0, r);
            return this.destroy(), n;
        }
    }
    function bh(e) {
        const t = (n, i)=>e(i).update(Cr(n)).digest(), r = e(new Uint8Array(32));
        return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = (n)=>e(n), t;
    }
    const gh = bh((e)=>new ph(e));
    function yh(e, t, r, n, i, o = 20) {
        let s = e[0], f = e[1], c = e[2], l = e[3], a = t[0], u = t[1], d = t[2], p = t[3], h = t[4], b = t[5], m = t[6], L = t[7], E = i, S = r[0], N = r[1], T = r[2], M = s, j = f, I = c, g = l, B = a, w = u, A = d, U = p, P = h, x = b, y = m, v = L, _ = E, O = S, R = N, C = T;
        for(let H = 0; H < o; H += 2)M = M + B | 0, _ = $(_ ^ M, 16), P = P + _ | 0, B = $(B ^ P, 12), M = M + B | 0, _ = $(_ ^ M, 8), P = P + _ | 0, B = $(B ^ P, 7), j = j + w | 0, O = $(O ^ j, 16), x = x + O | 0, w = $(w ^ x, 12), j = j + w | 0, O = $(O ^ j, 8), x = x + O | 0, w = $(w ^ x, 7), I = I + A | 0, R = $(R ^ I, 16), y = y + R | 0, A = $(A ^ y, 12), I = I + A | 0, R = $(R ^ I, 8), y = y + R | 0, A = $(A ^ y, 7), g = g + U | 0, C = $(C ^ g, 16), v = v + C | 0, U = $(U ^ v, 12), g = g + U | 0, C = $(C ^ g, 8), v = v + C | 0, U = $(U ^ v, 7), M = M + w | 0, C = $(C ^ M, 16), y = y + C | 0, w = $(w ^ y, 12), M = M + w | 0, C = $(C ^ M, 8), y = y + C | 0, w = $(w ^ y, 7), j = j + A | 0, _ = $(_ ^ j, 16), v = v + _ | 0, A = $(A ^ v, 12), j = j + A | 0, _ = $(_ ^ j, 8), v = v + _ | 0, A = $(A ^ v, 7), I = I + U | 0, O = $(O ^ I, 16), P = P + O | 0, U = $(U ^ P, 12), I = I + U | 0, O = $(O ^ I, 8), P = P + O | 0, U = $(U ^ P, 7), g = g + B | 0, R = $(R ^ g, 16), x = x + R | 0, B = $(B ^ x, 12), g = g + B | 0, R = $(R ^ g, 8), x = x + R | 0, B = $(B ^ x, 7);
        let k = 0;
        n[k++] = s + M | 0, n[k++] = f + j | 0, n[k++] = c + I | 0, n[k++] = l + g | 0, n[k++] = a + B | 0, n[k++] = u + w | 0, n[k++] = d + A | 0, n[k++] = p + U | 0, n[k++] = h + P | 0, n[k++] = b + x | 0, n[k++] = m + y | 0, n[k++] = L + v | 0, n[k++] = E + _ | 0, n[k++] = S + O | 0, n[k++] = N + R | 0, n[k++] = T + C | 0;
    }
    const wh = dh(yh, {
        counterRight: !1,
        counterLength: 4,
        allowShortKeys: !1
    }), mh = new Uint8Array(16), ro = (e, t)=>{
        e.update(t);
        const r = t.length % 16;
        r && e.update(mh.subarray(r));
    }, vh = new Uint8Array(32);
    function no(e, t, r, n, i) {
        const o = e(t, r, vh), s = gh.create(o);
        i && ro(s, i), ro(s, n);
        const f = ih(n.length, i ? i.length : 0, !0);
        s.update(f);
        const c = s.digest();
        return lt(o, f), c;
    }
    const xh = (e)=>(t, r, n)=>({
                encrypt (i, o) {
                    const s = i.length;
                    o = Xn(s + 16, o, !1), o.set(i);
                    const f = o.subarray(0, -16);
                    e(t, r, f, f, 1);
                    const c = no(e, t, r, f, n);
                    return o.set(c, s), lt(c), o;
                },
                decrypt (i, o) {
                    o = Xn(i.length - 16, o, !1);
                    const s = i.subarray(0, -16), f = i.subarray(-16), c = no(e, t, r, s, n);
                    if (!nh(f, c)) throw new Error("invalid tag");
                    return o.set(i.subarray(0, -16)), e(t, r, o, o, 1), lt(c), o;
                }
            });
    oh({
        blockSize: 64,
        nonceLength: 12,
        tagLength: 16
    }, xh(wh));
    let wi = class extends rr {
        constructor(e, t){
            super(), this.finished = !1, this.destroyed = !1, xu(e);
            const r = Te(t);
            if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
            this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
            const n = this.blockLen, i = new Uint8Array(n);
            i.set(r.length > n ? e.create().update(r).digest() : r);
            for(let o = 0; o < i.length; o++)i[o] ^= 54;
            this.iHash.update(i), this.oHash = e.create();
            for(let o = 0; o < i.length; o++)i[o] ^= 106;
            this.oHash.update(i), xe(i);
        }
        update(e) {
            return Ye(this), this.iHash.update(e), this;
        }
        digestInto(e) {
            Ye(this), ye(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
        }
        digest() {
            const e = new Uint8Array(this.oHash.outputLen);
            return this.digestInto(e), e;
        }
        _cloneInto(e) {
            e || (e = Object.create(Object.getPrototypeOf(this), {}));
            const { oHash: t, iHash: r, finished: n, destroyed: i, blockLen: o, outputLen: s } = this;
            return e = e, e.finished = n, e.destroyed = i, e.blockLen = o, e.outputLen = s, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
        }
        clone() {
            return this._cloneInto();
        }
        destroy() {
            this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
        }
    };
    const mi = (e, t, r)=>new wi(e, t).update(r).digest();
    mi.create = (e, t)=>new wi(e, t);
    Uint8Array.from([
        0
    ]);
    const en = BigInt(0), Rr = BigInt(1);
    function Zt(e, t) {
        if (typeof t != "boolean") throw new Error(e + " boolean expected, got " + t);
    }
    function Vt(e) {
        const t = e.toString(16);
        return t.length & 1 ? "0" + t : t;
    }
    function vi(e) {
        if (typeof e != "string") throw new Error("hex string expected, got " + typeof e);
        return e === "" ? en : BigInt("0x" + e);
    }
    function nr(e) {
        return vi(Nt(e));
    }
    function Jt(e) {
        return ye(e), vi(Nt(Uint8Array.from(e).reverse()));
    }
    function tn(e, t) {
        return Qr(e.toString(16).padStart(t * 2, "0"));
    }
    function rn(e, t) {
        return tn(e, t).reverse();
    }
    function he(e, t, r) {
        let n;
        if (typeof t == "string") try {
            n = Qr(t);
        } catch (o) {
            throw new Error(e + " must be hex string or Uint8Array, cause: " + o);
        }
        else if (Zr(t)) n = Uint8Array.from(t);
        else throw new Error(e + " must be hex string or Uint8Array");
        const i = n.length;
        if (typeof r == "number" && i !== r) throw new Error(e + " of length " + r + " expected, got " + i);
        return n;
    }
    const wr = (e)=>typeof e == "bigint" && en <= e;
    function Eh(e, t, r) {
        return wr(e) && wr(t) && wr(r) && t <= e && e < r;
    }
    function zr(e, t, r, n) {
        if (!Eh(t, r, n)) throw new Error("expected valid " + e + ": " + r + " <= n < " + n + ", got " + t);
    }
    function Ah(e) {
        let t;
        for(t = 0; e > en; e >>= Rr, t += 1);
        return t;
    }
    const or = (e)=>(Rr << BigInt(e)) - Rr;
    function _h(e, t, r) {
        if (typeof e != "number" || e < 2) throw new Error("hashLen must be a number");
        if (typeof t != "number" || t < 2) throw new Error("qByteLen must be a number");
        if (typeof r != "function") throw new Error("hmacFn must be a function");
        const n = (d)=>new Uint8Array(d), i = (d)=>Uint8Array.of(d);
        let o = n(e), s = n(e), f = 0;
        const c = ()=>{
            o.fill(1), s.fill(0), f = 0;
        }, l = (...d)=>r(s, o, ...d), a = (d = n(0))=>{
            s = l(i(0), d), o = l(), d.length !== 0 && (s = l(i(1), d), o = l());
        }, u = ()=>{
            if (f++ >= 1e3) throw new Error("drbg: tried 1000 values");
            let d = 0;
            const p = [];
            for(; d < t;){
                o = l();
                const h = o.slice();
                p.push(h), d += o.length;
            }
            return Je(...p);
        };
        return (d, p)=>{
            c(), a(d);
            let h;
            for(; !(h = p(u()));)a();
            return c(), h;
        };
    }
    function ir(e, t, r = {}) {
        if (!e || typeof e != "object") throw new Error("expected valid options object");
        function n(i, o, s) {
            const f = e[i];
            if (s && f === void 0) return;
            const c = typeof f;
            if (c !== o || f === null) throw new Error(`param "${i}" is invalid: expected ${o}, got ${c}`);
        }
        Object.entries(t).forEach(([i, o])=>n(i, o, !1)), Object.entries(r).forEach(([i, o])=>n(i, o, !0));
    }
    function oo(e) {
        const t = new WeakMap;
        return (r, ...n)=>{
            const i = t.get(r);
            if (i !== void 0) return i;
            const o = e(r, ...n);
            return t.set(r, o), o;
        };
    }
    const pe = BigInt(0), le = BigInt(1), Qe = BigInt(2), Oh = BigInt(3), xi = BigInt(4), Ei = BigInt(5), Ai = BigInt(8);
    function ge(e, t) {
        const r = e % t;
        return r >= pe ? r : t + r;
    }
    function me(e, t, r) {
        let n = e;
        for(; t-- > pe;)n *= n, n %= r;
        return n;
    }
    function io(e, t) {
        if (e === pe) throw new Error("invert: expected non-zero number");
        if (t <= pe) throw new Error("invert: expected positive modulus, got " + t);
        let r = ge(e, t), n = t, i = pe, o = le;
        for(; r !== pe;){
            const s = n / r, f = n % r, c = i - o * s;
            n = r, r = f, i = o, o = c;
        }
        if (n !== le) throw new Error("invert: does not exist");
        return ge(i, t);
    }
    function _i(e, t) {
        const r = (e.ORDER + le) / xi, n = e.pow(t, r);
        if (!e.eql(e.sqr(n), t)) throw new Error("Cannot find square root");
        return n;
    }
    function Sh(e, t) {
        const r = (e.ORDER - Ei) / Ai, n = e.mul(t, Qe), i = e.pow(n, r), o = e.mul(t, i), s = e.mul(e.mul(o, Qe), i), f = e.mul(o, e.sub(s, e.ONE));
        if (!e.eql(e.sqr(f), t)) throw new Error("Cannot find square root");
        return f;
    }
    function Bh(e) {
        if (e < BigInt(3)) throw new Error("sqrt is not defined for small field");
        let t = e - le, r = 0;
        for(; t % Qe === pe;)t /= Qe, r++;
        let n = Qe;
        const i = dt(e);
        for(; so(i, n) === 1;)if (n++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
        if (r === 1) return _i;
        let o = i.pow(n, t);
        const s = (t + le) / Qe;
        return function(f, c) {
            if (f.is0(c)) return c;
            if (so(f, c) !== 1) throw new Error("Cannot find square root");
            let l = r, a = f.mul(f.ONE, o), u = f.pow(c, t), d = f.pow(c, s);
            for(; !f.eql(u, f.ONE);){
                if (f.is0(u)) return f.ZERO;
                let p = 1, h = f.sqr(u);
                for(; !f.eql(h, f.ONE);)if (p++, h = f.sqr(h), p === l) throw new Error("Cannot find square root");
                const b = le << BigInt(l - p - 1), m = f.pow(a, b);
                l = p, a = f.sqr(m), u = f.mul(u, a), d = f.mul(d, m);
            }
            return d;
        };
    }
    function Uh(e) {
        return e % xi === Oh ? _i : e % Ai === Ei ? Sh : Bh(e);
    }
    const Nh = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
    ];
    function Ih(e) {
        const t = {
            ORDER: "bigint",
            MASK: "bigint",
            BYTES: "number",
            BITS: "number"
        }, r = Nh.reduce((n, i)=>(n[i] = "function", n), t);
        return ir(e, r), e;
    }
    function Lh(e, t, r) {
        if (r < pe) throw new Error("invalid exponent, negatives unsupported");
        if (r === pe) return e.ONE;
        if (r === le) return t;
        let n = e.ONE, i = t;
        for(; r > pe;)r & le && (n = e.mul(n, i)), i = e.sqr(i), r >>= le;
        return n;
    }
    function Oi(e, t, r = !1) {
        const n = new Array(t.length).fill(r ? e.ZERO : void 0), i = t.reduce((s, f, c)=>e.is0(f) ? s : (n[c] = s, e.mul(s, f)), e.ONE), o = e.inv(i);
        return t.reduceRight((s, f, c)=>e.is0(f) ? s : (n[c] = e.mul(s, n[c]), e.mul(s, f)), o), n;
    }
    function so(e, t) {
        const r = (e.ORDER - le) / Qe, n = e.pow(t, r), i = e.eql(n, e.ONE), o = e.eql(n, e.ZERO), s = e.eql(n, e.neg(e.ONE));
        if (!i && !o && !s) throw new Error("invalid Legendre symbol result");
        return i ? 1 : o ? 0 : -1;
    }
    function Th(e, t) {
        t !== void 0 && $e(t);
        const r = t !== void 0 ? t : e.toString(2).length, n = Math.ceil(r / 8);
        return {
            nBitLength: r,
            nByteLength: n
        };
    }
    function dt(e, t, r = !1, n = {}) {
        if (e <= pe) throw new Error("invalid field: expected ORDER > 0, got " + e);
        let i, o;
        if (typeof t == "object" && t != null) {
            if (n.sqrt || r) throw new Error("cannot specify opts in two arguments");
            const a = t;
            a.BITS && (i = a.BITS), a.sqrt && (o = a.sqrt), typeof a.isLE == "boolean" && (r = a.isLE);
        } else typeof t == "number" && (i = t), n.sqrt && (o = n.sqrt);
        const { nBitLength: s, nByteLength: f } = Th(e, i);
        if (f > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
        let c;
        const l = Object.freeze({
            ORDER: e,
            isLE: r,
            BITS: s,
            BYTES: f,
            MASK: or(s),
            ZERO: pe,
            ONE: le,
            create: (a)=>ge(a, e),
            isValid: (a)=>{
                if (typeof a != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof a);
                return pe <= a && a < e;
            },
            is0: (a)=>a === pe,
            isValidNot0: (a)=>!l.is0(a) && l.isValid(a),
            isOdd: (a)=>(a & le) === le,
            neg: (a)=>ge(-a, e),
            eql: (a, u)=>a === u,
            sqr: (a)=>ge(a * a, e),
            add: (a, u)=>ge(a + u, e),
            sub: (a, u)=>ge(a - u, e),
            mul: (a, u)=>ge(a * u, e),
            pow: (a, u)=>Lh(l, a, u),
            div: (a, u)=>ge(a * io(u, e), e),
            sqrN: (a)=>a * a,
            addN: (a, u)=>a + u,
            subN: (a, u)=>a - u,
            mulN: (a, u)=>a * u,
            inv: (a)=>io(a, e),
            sqrt: o || ((a)=>(c || (c = Uh(e)), c(l, a))),
            toBytes: (a)=>r ? rn(a, f) : tn(a, f),
            fromBytes: (a)=>{
                if (a.length !== f) throw new Error("Field.fromBytes: expected " + f + " bytes, got " + a.length);
                return r ? Jt(a) : nr(a);
            },
            invertBatch: (a)=>Oi(l, a),
            cmov: (a, u, d)=>d ? u : a
        });
        return Object.freeze(l);
    }
    function Si(e) {
        if (typeof e != "bigint") throw new Error("field order must be bigint");
        const t = e.toString(2).length;
        return Math.ceil(t / 8);
    }
    function Bi(e) {
        const t = Si(e);
        return t + Math.ceil(t / 2);
    }
    function Ch(e, t, r = !1) {
        const n = e.length, i = Si(t), o = Bi(t);
        if (n < 16 || n < o || n > 1024) throw new Error("expected " + o + "-1024 bytes of input, got " + n);
        const s = r ? Jt(e) : nr(e), f = ge(s, t - le) + le;
        return r ? rn(f, i) : tn(f, i);
    }
    const ut = BigInt(0), Xe = BigInt(1);
    function Et(e, t) {
        const r = t.negate();
        return e ? r : t;
    }
    function Ph(e, t, r) {
        const n = (o)=>o.pz, i = Oi(e.Fp, r.map(n));
        return r.map((o, s)=>o.toAffine(i[s])).map(e.fromAffine);
    }
    function Ui(e, t) {
        if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw new Error("invalid window size, expected [1.." + t + "], got W=" + e);
    }
    function mr(e, t) {
        Ui(e, t);
        const r = Math.ceil(t / e) + 1, n = 2 ** (e - 1), i = 2 ** e, o = or(e), s = BigInt(e);
        return {
            windows: r,
            windowSize: n,
            mask: o,
            maxNumber: i,
            shiftBy: s
        };
    }
    function fo(e, t, r) {
        const { windowSize: n, mask: i, maxNumber: o, shiftBy: s } = r;
        let f = Number(e & i), c = e >> s;
        f > n && (f -= o, c += Xe);
        const l = t * n, a = l + Math.abs(f) - 1, u = f === 0, d = f < 0, p = t % 2 !== 0;
        return {
            nextN: c,
            offset: a,
            isZero: u,
            isNeg: d,
            isNegF: p,
            offsetF: l
        };
    }
    function jh(e, t) {
        if (!Array.isArray(e)) throw new Error("array expected");
        e.forEach((r, n)=>{
            if (!(r instanceof t)) throw new Error("invalid point at index " + n);
        });
    }
    function Rh(e, t) {
        if (!Array.isArray(e)) throw new Error("array of scalars expected");
        e.forEach((r, n)=>{
            if (!t.isValid(r)) throw new Error("invalid scalar at index " + n);
        });
    }
    const vr = new WeakMap, Ni = new WeakMap;
    function xr(e) {
        return Ni.get(e) || 1;
    }
    function ao(e) {
        if (e !== ut) throw new Error("invalid wNAF");
    }
    function zh(e, t) {
        return {
            constTimeNegate: Et,
            hasPrecomputes (r) {
                return xr(r) !== 1;
            },
            unsafeLadder (r, n, i = e.ZERO) {
                let o = r;
                for(; n > ut;)n & Xe && (i = i.add(o)), o = o.double(), n >>= Xe;
                return i;
            },
            precomputeWindow (r, n) {
                const { windows: i, windowSize: o } = mr(n, t), s = [];
                let f = r, c = f;
                for(let l = 0; l < i; l++){
                    c = f, s.push(c);
                    for(let a = 1; a < o; a++)c = c.add(f), s.push(c);
                    f = c.double();
                }
                return s;
            },
            wNAF (r, n, i) {
                let o = e.ZERO, s = e.BASE;
                const f = mr(r, t);
                for(let c = 0; c < f.windows; c++){
                    const { nextN: l, offset: a, isZero: u, isNeg: d, isNegF: p, offsetF: h } = fo(i, c, f);
                    i = l, u ? s = s.add(Et(p, n[h])) : o = o.add(Et(d, n[a]));
                }
                return ao(i), {
                    p: o,
                    f: s
                };
            },
            wNAFUnsafe (r, n, i, o = e.ZERO) {
                const s = mr(r, t);
                for(let f = 0; f < s.windows && i !== ut; f++){
                    const { nextN: c, offset: l, isZero: a, isNeg: u } = fo(i, f, s);
                    if (i = c, !a) {
                        const d = n[l];
                        o = o.add(u ? d.negate() : d);
                    }
                }
                return ao(i), o;
            },
            getPrecomputes (r, n, i) {
                let o = vr.get(n);
                return o || (o = this.precomputeWindow(n, r), r !== 1 && (typeof i == "function" && (o = i(o)), vr.set(n, o))), o;
            },
            wNAFCached (r, n, i) {
                const o = xr(r);
                return this.wNAF(o, this.getPrecomputes(o, r, i), n);
            },
            wNAFCachedUnsafe (r, n, i, o) {
                const s = xr(r);
                return s === 1 ? this.unsafeLadder(r, n, o) : this.wNAFUnsafe(s, this.getPrecomputes(s, r, i), n, o);
            },
            setWindowSize (r, n) {
                Ui(n, t), Ni.set(r, n), vr.delete(r);
            }
        };
    }
    function kh(e, t, r, n) {
        let i = t, o = e.ZERO, s = e.ZERO;
        for(; r > ut || n > ut;)r & Xe && (o = o.add(i)), n & Xe && (s = s.add(i)), i = i.double(), r >>= Xe, n >>= Xe;
        return {
            p1: o,
            p2: s
        };
    }
    function Mh(e, t, r, n) {
        jh(r, e), Rh(n, t);
        const i = r.length, o = n.length;
        if (i !== o) throw new Error("arrays of points and scalars must have equal length");
        const s = e.ZERO, f = Ah(BigInt(i));
        let c = 1;
        f > 12 ? c = f - 3 : f > 4 ? c = f - 2 : f > 0 && (c = 2);
        const l = or(c), a = new Array(Number(l) + 1).fill(s), u = Math.floor((t.BITS - 1) / c) * c;
        let d = s;
        for(let p = u; p >= 0; p -= c){
            a.fill(s);
            for(let b = 0; b < o; b++){
                const m = n[b], L = Number(m >> BigInt(p) & l);
                a[L] = a[L].add(r[b]);
            }
            let h = s;
            for(let b = a.length - 1, m = s; b > 0; b--)m = m.add(a[b]), h = h.add(m);
            if (d = d.add(h), p !== 0) for(let b = 0; b < c; b++)d = d.double();
        }
        return d;
    }
    function co(e, t) {
        if (t) {
            if (t.ORDER !== e) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
            return Ih(t), t;
        } else return dt(e);
    }
    function Hh(e, t, r = {}) {
        if (!t || typeof t != "object") throw new Error(`expected valid ${e} CURVE object`);
        for (const s of [
            "p",
            "n",
            "h"
        ]){
            const f = t[s];
            if (!(typeof f == "bigint" && f > ut)) throw new Error(`CURVE.${s} must be positive bigint`);
        }
        const n = co(t.p, r.Fp), i = co(t.n, r.Fn), o = [
            "Gx",
            "Gy",
            "a",
            "b"
        ];
        for (const s of o)if (!n.isValid(t[s])) throw new Error(`CURVE.${s} must be valid field element of CURVE.Fp`);
        return {
            Fp: n,
            Fn: i
        };
    }
    BigInt(0), BigInt(1), BigInt(2), BigInt(8);
    const mt = BigInt(0), at = BigInt(1), Kt = BigInt(2);
    function Fh(e) {
        return ir(e, {
            adjustScalarBytes: "function",
            powPminus2: "function"
        }), Object.freeze({
            ...e
        });
    }
    function Dh(e) {
        const t = Fh(e), { P: r, type: n, adjustScalarBytes: i, powPminus2: o, randomBytes: s } = t, f = n === "x25519";
        if (!f && n !== "x448") throw new Error("invalid type");
        const c = s || fi, l = f ? 255 : 448, a = f ? 32 : 56, u = BigInt(f ? 9 : 5), d = BigInt(f ? 121665 : 39081), p = f ? Kt ** BigInt(254) : Kt ** BigInt(447), h = f ? BigInt(8) * Kt ** BigInt(251) - at : BigInt(4) * Kt ** BigInt(445) - at, b = p + h + at, m = (g)=>ge(g, r), L = E(u);
        function E(g) {
            return rn(m(g), a);
        }
        function S(g) {
            const B = he("u coordinate", g, a);
            return f && (B[31] &= 127), m(Jt(B));
        }
        function N(g) {
            return Jt(i(he("scalar", g, a)));
        }
        function T(g, B) {
            const w = I(S(B), N(g));
            if (w === mt) throw new Error("invalid private or public key received");
            return E(w);
        }
        function M(g) {
            return T(g, L);
        }
        function j(g, B, w) {
            const A = m(g * (B - w));
            return B = m(B - A), w = m(w + A), {
                x_2: B,
                x_3: w
            };
        }
        function I(g, B) {
            zr("u", g, mt, r), zr("scalar", B, p, b);
            const w = B, A = g;
            let U = at, P = mt, x = g, y = at, v = mt;
            for(let O = BigInt(l - 1); O >= mt; O--){
                const R = w >> O & at;
                v ^= R, { x_2: U, x_3: x } = j(v, U, x), { x_2: P, x_3: y } = j(v, P, y), v = R;
                const C = U + P, k = m(C * C), H = U - P, F = m(H * H), D = k - F, V = x + y, J = x - y, W = m(J * C), Y = m(V * H), re = W + Y, be = W - Y;
                x = m(re * re), y = m(A * m(be * be)), U = m(k * F), P = m(D * (k + m(d * D)));
            }
            ({ x_2: U, x_3: x } = j(v, U, x)), { x_2: P, x_3: y } = j(v, P, y);
            const _ = o(P);
            return m(U * _);
        }
        return {
            scalarMult: T,
            scalarMultBase: M,
            getSharedSecret: (g, B)=>T(g, B),
            getPublicKey: (g)=>M(g),
            utils: {
                randomPrivateKey: ()=>c(a)
            },
            GuBytes: L.slice()
        };
    }
    BigInt(0);
    const qh = BigInt(1), lo = BigInt(2), Vh = BigInt(3), Kh = BigInt(5);
    BigInt(8);
    const Ii = {
        p: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"),
        n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
        a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
        d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
        Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
        Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
    };
    function $h(e) {
        const t = BigInt(10), r = BigInt(20), n = BigInt(40), i = BigInt(80), o = Ii.p, s = e * e % o * e % o, f = me(s, lo, o) * s % o, c = me(f, qh, o) * e % o, l = me(c, Kh, o) * c % o, a = me(l, t, o) * l % o, u = me(a, r, o) * a % o, d = me(u, n, o) * u % o, p = me(d, i, o) * d % o, h = me(p, i, o) * d % o, b = me(h, t, o) * l % o;
        return {
            pow_p_5_8: me(b, lo, o) * e % o,
            b2: s
        };
    }
    function Yh(e) {
        return e[0] &= 248, e[31] &= 127, e[31] |= 64, e;
    }
    (()=>{
        const e = Ii.p;
        return Dh({
            P: e,
            type: "x25519",
            powPminus2: (t)=>{
                const { pow_p_5_8: r, b2: n } = $h(t);
                return ge(me(r, Vh, e) * n, e);
            },
            adjustScalarBytes: Yh
        });
    })();
    function uo(e) {
        e.lowS !== void 0 && Zt("lowS", e.lowS), e.prehash !== void 0 && Zt("prehash", e.prehash);
    }
    class Gh extends Error {
        constructor(t = ""){
            super(t);
        }
    }
    const Ie = {
        Err: Gh,
        _tlv: {
            encode: (e, t)=>{
                const { Err: r } = Ie;
                if (e < 0 || e > 256) throw new r("tlv.encode: wrong tag");
                if (t.length & 1) throw new r("tlv.encode: unpadded data");
                const n = t.length / 2, i = Vt(n);
                if (i.length / 2 & 128) throw new r("tlv.encode: long form length too big");
                const o = n > 127 ? Vt(i.length / 2 | 128) : "";
                return Vt(e) + o + i + t;
            },
            decode (e, t) {
                const { Err: r } = Ie;
                let n = 0;
                if (e < 0 || e > 256) throw new r("tlv.encode: wrong tag");
                if (t.length < 2 || t[n++] !== e) throw new r("tlv.decode: wrong tlv");
                const i = t[n++], o = !!(i & 128);
                let s = 0;
                if (!o) s = i;
                else {
                    const c = i & 127;
                    if (!c) throw new r("tlv.decode(long): indefinite length not supported");
                    if (c > 4) throw new r("tlv.decode(long): byte length is too big");
                    const l = t.subarray(n, n + c);
                    if (l.length !== c) throw new r("tlv.decode: length bytes not complete");
                    if (l[0] === 0) throw new r("tlv.decode(long): zero leftmost byte");
                    for (const a of l)s = s << 8 | a;
                    if (n += c, s < 128) throw new r("tlv.decode(long): not minimal encoding");
                }
                const f = t.subarray(n, n + s);
                if (f.length !== s) throw new r("tlv.decode: wrong value length");
                return {
                    v: f,
                    l: t.subarray(n + s)
                };
            }
        },
        _int: {
            encode (e) {
                const { Err: t } = Ie;
                if (e < At) throw new t("integer: negative integers are not allowed");
                let r = Vt(e);
                if (Number.parseInt(r[0], 16) & 8 && (r = "00" + r), r.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
                return r;
            },
            decode (e) {
                const { Err: t } = Ie;
                if (e[0] & 128) throw new t("invalid signature integer: negative");
                if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
                return nr(e);
            }
        },
        toSig (e) {
            const { Err: t, _int: r, _tlv: n } = Ie, i = he("signature", e), { v: o, l: s } = n.decode(48, i);
            if (s.length) throw new t("invalid signature: left bytes after parsing");
            const { v: f, l: c } = n.decode(2, o), { v: l, l: a } = n.decode(2, c);
            if (a.length) throw new t("invalid signature: left bytes after parsing");
            return {
                r: r.decode(f),
                s: r.decode(l)
            };
        },
        hexFromSig (e) {
            const { _tlv: t, _int: r } = Ie, n = t.encode(2, r.encode(e.r)), i = t.encode(2, r.encode(e.s)), o = n + i;
            return t.encode(48, o);
        }
    }, At = BigInt(0), _t = BigInt(1), Wh = BigInt(2), $t = BigInt(3), Zh = BigInt(4);
    function Jh(e, t, r) {
        function n(i) {
            const o = e.sqr(i), s = e.mul(o, i);
            return e.add(e.add(s, e.mul(i, t)), r);
        }
        return n;
    }
    function Li(e, t, r) {
        const { BYTES: n } = e;
        function i(o) {
            let s;
            if (typeof o == "bigint") s = o;
            else {
                let f = he("private key", o);
                if (t) {
                    if (!t.includes(f.length * 2)) throw new Error("invalid private key");
                    const c = new Uint8Array(n);
                    c.set(f, c.length - f.length), f = c;
                }
                try {
                    s = e.fromBytes(f);
                } catch  {
                    throw new Error(`invalid private key: expected ui8a of size ${n}, got ${typeof o}`);
                }
            }
            if (r && (s = e.create(s)), !e.isValidNot0(s)) throw new Error("invalid private key: out of range [1..N-1]");
            return s;
        }
        return i;
    }
    function Qh(e, t = {}) {
        const { Fp: r, Fn: n } = Hh("weierstrass", e, t), { h: i, n: o } = e;
        ir(t, {}, {
            allowInfinityPoint: "boolean",
            clearCofactor: "function",
            isTorsionFree: "function",
            fromBytes: "function",
            toBytes: "function",
            endo: "object",
            wrapPrivateKey: "boolean"
        });
        const { endo: s } = t;
        if (s && (!r.is0(e.a) || typeof s.beta != "bigint" || typeof s.splitScalar != "function")) throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
        function f() {
            if (!r.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
        }
        function c(I, g, B) {
            const { x: w, y: A } = g.toAffine(), U = r.toBytes(w);
            if (Zt("isCompressed", B), B) {
                f();
                const P = !r.isOdd(A);
                return Je(Ti(P), U);
            } else return Je(Uint8Array.of(4), U, r.toBytes(A));
        }
        function l(I) {
            ye(I);
            const g = r.BYTES, B = g + 1, w = 2 * g + 1, A = I.length, U = I[0], P = I.subarray(1);
            if (A === B && (U === 2 || U === 3)) {
                const x = r.fromBytes(P);
                if (!r.isValid(x)) throw new Error("bad point: is not on curve, wrong x");
                const y = d(x);
                let v;
                try {
                    v = r.sqrt(y);
                } catch (O) {
                    const R = O instanceof Error ? ": " + O.message : "";
                    throw new Error("bad point: is not on curve, sqrt error" + R);
                }
                f();
                const _ = r.isOdd(v);
                return (U & 1) === 1 !== _ && (v = r.neg(v)), {
                    x,
                    y: v
                };
            } else if (A === w && U === 4) {
                const x = r.fromBytes(P.subarray(g * 0, g * 1)), y = r.fromBytes(P.subarray(g * 1, g * 2));
                if (!p(x, y)) throw new Error("bad point: is not on curve");
                return {
                    x,
                    y
                };
            } else throw new Error(`bad point: got length ${A}, expected compressed=${B} or uncompressed=${w}`);
        }
        const a = t.toBytes || c, u = t.fromBytes || l, d = Jh(r, e.a, e.b);
        function p(I, g) {
            const B = r.sqr(g), w = d(I);
            return r.eql(B, w);
        }
        if (!p(e.Gx, e.Gy)) throw new Error("bad curve params: generator point");
        const h = r.mul(r.pow(e.a, $t), Zh), b = r.mul(r.sqr(e.b), BigInt(27));
        if (r.is0(r.add(h, b))) throw new Error("bad curve params: a or b");
        function m(I, g, B = !1) {
            if (!r.isValid(g) || B && r.is0(g)) throw new Error(`bad point coordinate ${I}`);
            return g;
        }
        function L(I) {
            if (!(I instanceof T)) throw new Error("ProjectivePoint expected");
        }
        const E = oo((I, g)=>{
            const { px: B, py: w, pz: A } = I;
            if (r.eql(A, r.ONE)) return {
                x: B,
                y: w
            };
            const U = I.is0();
            g == null && (g = U ? r.ONE : r.inv(A));
            const P = r.mul(B, g), x = r.mul(w, g), y = r.mul(A, g);
            if (U) return {
                x: r.ZERO,
                y: r.ZERO
            };
            if (!r.eql(y, r.ONE)) throw new Error("invZ was invalid");
            return {
                x: P,
                y: x
            };
        }), S = oo((I)=>{
            if (I.is0()) {
                if (t.allowInfinityPoint && !r.is0(I.py)) return;
                throw new Error("bad point: ZERO");
            }
            const { x: g, y: B } = I.toAffine();
            if (!r.isValid(g) || !r.isValid(B)) throw new Error("bad point: x or y not field elements");
            if (!p(g, B)) throw new Error("bad point: equation left != right");
            if (!I.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
            return !0;
        });
        function N(I, g, B, w, A) {
            return B = new T(r.mul(B.px, I), B.py, B.pz), g = Et(w, g), B = Et(A, B), g.add(B);
        }
        class T {
            constructor(g, B, w){
                this.px = m("x", g), this.py = m("y", B, !0), this.pz = m("z", w), Object.freeze(this);
            }
            static fromAffine(g) {
                const { x: B, y: w } = g || {};
                if (!g || !r.isValid(B) || !r.isValid(w)) throw new Error("invalid affine point");
                if (g instanceof T) throw new Error("projective point not allowed");
                return r.is0(B) && r.is0(w) ? T.ZERO : new T(B, w, r.ONE);
            }
            get x() {
                return this.toAffine().x;
            }
            get y() {
                return this.toAffine().y;
            }
            static normalizeZ(g) {
                return Ph(T, "pz", g);
            }
            static fromBytes(g) {
                return ye(g), T.fromHex(g);
            }
            static fromHex(g) {
                const B = T.fromAffine(u(he("pointHex", g)));
                return B.assertValidity(), B;
            }
            static fromPrivateKey(g) {
                const B = Li(n, t.allowedPrivateKeyLengths, t.wrapPrivateKey);
                return T.BASE.multiply(B(g));
            }
            static msm(g, B) {
                return Mh(T, n, g, B);
            }
            precompute(g = 8, B = !0) {
                return j.setWindowSize(this, g), B || this.multiply($t), this;
            }
            _setWindowSize(g) {
                this.precompute(g);
            }
            assertValidity() {
                S(this);
            }
            hasEvenY() {
                const { y: g } = this.toAffine();
                if (!r.isOdd) throw new Error("Field doesn't support isOdd");
                return !r.isOdd(g);
            }
            equals(g) {
                L(g);
                const { px: B, py: w, pz: A } = this, { px: U, py: P, pz: x } = g, y = r.eql(r.mul(B, x), r.mul(U, A)), v = r.eql(r.mul(w, x), r.mul(P, A));
                return y && v;
            }
            negate() {
                return new T(this.px, r.neg(this.py), this.pz);
            }
            double() {
                const { a: g, b: B } = e, w = r.mul(B, $t), { px: A, py: U, pz: P } = this;
                let x = r.ZERO, y = r.ZERO, v = r.ZERO, _ = r.mul(A, A), O = r.mul(U, U), R = r.mul(P, P), C = r.mul(A, U);
                return C = r.add(C, C), v = r.mul(A, P), v = r.add(v, v), x = r.mul(g, v), y = r.mul(w, R), y = r.add(x, y), x = r.sub(O, y), y = r.add(O, y), y = r.mul(x, y), x = r.mul(C, x), v = r.mul(w, v), R = r.mul(g, R), C = r.sub(_, R), C = r.mul(g, C), C = r.add(C, v), v = r.add(_, _), _ = r.add(v, _), _ = r.add(_, R), _ = r.mul(_, C), y = r.add(y, _), R = r.mul(U, P), R = r.add(R, R), _ = r.mul(R, C), x = r.sub(x, _), v = r.mul(R, O), v = r.add(v, v), v = r.add(v, v), new T(x, y, v);
            }
            add(g) {
                L(g);
                const { px: B, py: w, pz: A } = this, { px: U, py: P, pz: x } = g;
                let y = r.ZERO, v = r.ZERO, _ = r.ZERO;
                const O = e.a, R = r.mul(e.b, $t);
                let C = r.mul(B, U), k = r.mul(w, P), H = r.mul(A, x), F = r.add(B, w), D = r.add(U, P);
                F = r.mul(F, D), D = r.add(C, k), F = r.sub(F, D), D = r.add(B, A);
                let V = r.add(U, x);
                return D = r.mul(D, V), V = r.add(C, H), D = r.sub(D, V), V = r.add(w, A), y = r.add(P, x), V = r.mul(V, y), y = r.add(k, H), V = r.sub(V, y), _ = r.mul(O, D), y = r.mul(R, H), _ = r.add(y, _), y = r.sub(k, _), _ = r.add(k, _), v = r.mul(y, _), k = r.add(C, C), k = r.add(k, C), H = r.mul(O, H), D = r.mul(R, D), k = r.add(k, H), H = r.sub(C, H), H = r.mul(O, H), D = r.add(D, H), C = r.mul(k, D), v = r.add(v, C), C = r.mul(V, D), y = r.mul(F, y), y = r.sub(y, C), C = r.mul(F, k), _ = r.mul(V, _), _ = r.add(_, C), new T(y, v, _);
            }
            subtract(g) {
                return this.add(g.negate());
            }
            is0() {
                return this.equals(T.ZERO);
            }
            multiply(g) {
                const { endo: B } = t;
                if (!n.isValidNot0(g)) throw new Error("invalid scalar: out of range");
                let w, A;
                const U = (P)=>j.wNAFCached(this, P, T.normalizeZ);
                if (B) {
                    const { k1neg: P, k1: x, k2neg: y, k2: v } = B.splitScalar(g), { p: _, f: O } = U(x), { p: R, f: C } = U(v);
                    A = O.add(C), w = N(B.beta, _, R, P, y);
                } else {
                    const { p: P, f: x } = U(g);
                    w = P, A = x;
                }
                return T.normalizeZ([
                    w,
                    A
                ])[0];
            }
            multiplyUnsafe(g) {
                const { endo: B } = t, w = this;
                if (!n.isValid(g)) throw new Error("invalid scalar: out of range");
                if (g === At || w.is0()) return T.ZERO;
                if (g === _t) return w;
                if (j.hasPrecomputes(this)) return this.multiply(g);
                if (B) {
                    const { k1neg: A, k1: U, k2neg: P, k2: x } = B.splitScalar(g), { p1: y, p2: v } = kh(T, w, U, x);
                    return N(B.beta, y, v, A, P);
                } else return j.wNAFCachedUnsafe(w, g);
            }
            multiplyAndAddUnsafe(g, B, w) {
                const A = this.multiplyUnsafe(B).add(g.multiplyUnsafe(w));
                return A.is0() ? void 0 : A;
            }
            toAffine(g) {
                return E(this, g);
            }
            isTorsionFree() {
                const { isTorsionFree: g } = t;
                return i === _t ? !0 : g ? g(T, this) : j.wNAFCachedUnsafe(this, o).is0();
            }
            clearCofactor() {
                const { clearCofactor: g } = t;
                return i === _t ? this : g ? g(T, this) : this.multiplyUnsafe(i);
            }
            toBytes(g = !0) {
                return Zt("isCompressed", g), this.assertValidity(), a(T, this, g);
            }
            toRawBytes(g = !0) {
                return this.toBytes(g);
            }
            toHex(g = !0) {
                return Nt(this.toBytes(g));
            }
            toString() {
                return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
            }
        }
        T.BASE = new T(e.Gx, e.Gy, r.ONE), T.ZERO = new T(r.ZERO, r.ONE, r.ZERO), T.Fp = r, T.Fn = n;
        const M = n.BITS, j = zh(T, t.endo ? Math.ceil(M / 2) : M);
        return T;
    }
    function Ti(e) {
        return Uint8Array.of(e ? 2 : 3);
    }
    function Xh(e, t, r = {}) {
        ir(t, {
            hash: "function"
        }, {
            hmac: "function",
            lowS: "boolean",
            randomBytes: "function",
            bits2int: "function",
            bits2int_modN: "function"
        });
        const n = t.randomBytes || fi, i = t.hmac || ((w, ...A)=>mi(t.hash, w, Je(...A))), { Fp: o, Fn: s } = e, { ORDER: f, BITS: c } = s;
        function l(w) {
            const A = f >> _t;
            return w > A;
        }
        function a(w) {
            return l(w) ? s.neg(w) : w;
        }
        function u(w, A) {
            if (!s.isValidNot0(A)) throw new Error(`invalid signature ${w}: out of range 1..CURVE.n`);
        }
        class d {
            constructor(A, U, P){
                u("r", A), u("s", U), this.r = A, this.s = U, P != null && (this.recovery = P), Object.freeze(this);
            }
            static fromCompact(A) {
                const U = s.BYTES, P = he("compactSignature", A, U * 2);
                return new d(s.fromBytes(P.subarray(0, U)), s.fromBytes(P.subarray(U, U * 2)));
            }
            static fromDER(A) {
                const { r: U, s: P } = Ie.toSig(he("DER", A));
                return new d(U, P);
            }
            assertValidity() {}
            addRecoveryBit(A) {
                return new d(this.r, this.s, A);
            }
            recoverPublicKey(A) {
                const U = o.ORDER, { r: P, s: x, recovery: y } = this;
                if (y == null || ![
                    0,
                    1,
                    2,
                    3
                ].includes(y)) throw new Error("recovery id invalid");
                if (f * Wh < U && y > 1) throw new Error("recovery id is ambiguous for h>1 curve");
                const v = y === 2 || y === 3 ? P + f : P;
                if (!o.isValid(v)) throw new Error("recovery id 2 or 3 invalid");
                const _ = o.toBytes(v), O = e.fromHex(Je(Ti((y & 1) === 0), _)), R = s.inv(v), C = S(he("msgHash", A)), k = s.create(-C * R), H = s.create(x * R), F = e.BASE.multiplyUnsafe(k).add(O.multiplyUnsafe(H));
                if (F.is0()) throw new Error("point at infinify");
                return F.assertValidity(), F;
            }
            hasHighS() {
                return l(this.s);
            }
            normalizeS() {
                return this.hasHighS() ? new d(this.r, s.neg(this.s), this.recovery) : this;
            }
            toBytes(A) {
                if (A === "compact") return Je(s.toBytes(this.r), s.toBytes(this.s));
                if (A === "der") return Qr(Ie.hexFromSig(this));
                throw new Error("invalid format");
            }
            toDERRawBytes() {
                return this.toBytes("der");
            }
            toDERHex() {
                return Nt(this.toBytes("der"));
            }
            toCompactRawBytes() {
                return this.toBytes("compact");
            }
            toCompactHex() {
                return Nt(this.toBytes("compact"));
            }
        }
        const p = Li(s, r.allowedPrivateKeyLengths, r.wrapPrivateKey), h = {
            isValidPrivateKey (w) {
                try {
                    return p(w), !0;
                } catch  {
                    return !1;
                }
            },
            normPrivateKeyToScalar: p,
            randomPrivateKey: ()=>{
                const w = f;
                return Ch(n(Bi(w)), w);
            },
            precompute (w = 8, A = e.BASE) {
                return A.precompute(w, !1);
            }
        };
        function b(w, A = !0) {
            return e.fromPrivateKey(w).toBytes(A);
        }
        function m(w) {
            if (typeof w == "bigint") return !1;
            if (w instanceof e) return !0;
            const A = he("key", w).length, U = o.BYTES, P = U + 1, x = 2 * U + 1;
            if (!(r.allowedPrivateKeyLengths || s.BYTES === P)) return A === P || A === x;
        }
        function L(w, A, U = !0) {
            if (m(w) === !0) throw new Error("first arg must be private key");
            if (m(A) === !1) throw new Error("second arg must be public key");
            return e.fromHex(A).multiply(p(w)).toBytes(U);
        }
        const E = t.bits2int || function(w) {
            if (w.length > 8192) throw new Error("input is too large");
            const A = nr(w), U = w.length * 8 - c;
            return U > 0 ? A >> BigInt(U) : A;
        }, S = t.bits2int_modN || function(w) {
            return s.create(E(w));
        }, N = or(c);
        function T(w) {
            return zr("num < 2^" + c, w, At, N), s.toBytes(w);
        }
        function M(w, A, U = j) {
            if ([
                "recovered",
                "canonical"
            ].some((F)=>F in U)) throw new Error("sign() legacy options not supported");
            const { hash: P } = t;
            let { lowS: x, prehash: y, extraEntropy: v } = U;
            x == null && (x = !0), w = he("msgHash", w), uo(U), y && (w = he("prehashed msgHash", P(w)));
            const _ = S(w), O = p(A), R = [
                T(O),
                T(_)
            ];
            if (v != null && v !== !1) {
                const F = v === !0 ? n(o.BYTES) : v;
                R.push(he("extraEntropy", F));
            }
            const C = Je(...R), k = _;
            function H(F) {
                const D = E(F);
                if (!s.isValidNot0(D)) return;
                const V = s.inv(D), J = e.BASE.multiply(D).toAffine(), W = s.create(J.x);
                if (W === At) return;
                const Y = s.create(V * s.create(k + W * O));
                if (Y === At) return;
                let re = (J.x === W ? 0 : 2) | Number(J.y & _t), be = Y;
                return x && l(Y) && (be = a(Y), re ^= 1), new d(W, be, re);
            }
            return {
                seed: C,
                k2sig: H
            };
        }
        const j = {
            lowS: t.lowS,
            prehash: !1
        }, I = {
            lowS: t.lowS,
            prehash: !1
        };
        function g(w, A, U = j) {
            const { seed: P, k2sig: x } = M(w, A, U);
            return _h(t.hash.outputLen, s.BYTES, i)(P, x);
        }
        e.BASE.precompute(8);
        function B(w, A, U, P = I) {
            const x = w;
            A = he("msgHash", A), U = he("publicKey", U), uo(P);
            const { lowS: y, prehash: v, format: _ } = P;
            if ("strict" in P) throw new Error("options.strict was renamed to lowS");
            if (_ !== void 0 && ![
                "compact",
                "der",
                "js"
            ].includes(_)) throw new Error('format must be "compact", "der" or "js"');
            const O = typeof x == "string" || Zr(x), R = !O && !_ && typeof x == "object" && x !== null && typeof x.r == "bigint" && typeof x.s == "bigint";
            if (!O && !R) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
            let C, k;
            try {
                if (R) if (_ === void 0 || _ === "js") C = new d(x.r, x.s);
                else throw new Error("invalid format");
                if (O) {
                    try {
                        _ !== "compact" && (C = d.fromDER(x));
                    } catch (re) {
                        if (!(re instanceof Ie.Err)) throw re;
                    }
                    !C && _ !== "der" && (C = d.fromCompact(x));
                }
                k = e.fromHex(U);
            } catch  {
                return !1;
            }
            if (!C || y && C.hasHighS()) return !1;
            v && (A = t.hash(A));
            const { r: H, s: F } = C, D = S(A), V = s.inv(F), J = s.create(D * V), W = s.create(H * V), Y = e.BASE.multiplyUnsafe(J).add(k.multiplyUnsafe(W));
            return Y.is0() ? !1 : s.create(Y.x) === H;
        }
        return Object.freeze({
            getPublicKey: b,
            getSharedSecret: L,
            sign: g,
            verify: B,
            utils: h,
            Point: e,
            Signature: d
        });
    }
    function e0(e) {
        const t = {
            a: e.a,
            b: e.b,
            p: e.Fp.ORDER,
            n: e.n,
            h: e.h,
            Gx: e.Gx,
            Gy: e.Gy
        }, r = e.Fp, n = dt(t.n, e.nBitLength), i = {
            Fp: r,
            Fn: n,
            allowedPrivateKeyLengths: e.allowedPrivateKeyLengths,
            allowInfinityPoint: e.allowInfinityPoint,
            endo: e.endo,
            wrapPrivateKey: e.wrapPrivateKey,
            isTorsionFree: e.isTorsionFree,
            clearCofactor: e.clearCofactor,
            fromBytes: e.fromBytes,
            toBytes: e.toBytes
        };
        return {
            CURVE: t,
            curveOpts: i
        };
    }
    function t0(e) {
        const { CURVE: t, curveOpts: r } = e0(e), n = {
            hash: e.hash,
            hmac: e.hmac,
            randomBytes: e.randomBytes,
            lowS: e.lowS,
            bits2int: e.bits2int,
            bits2int_modN: e.bits2int_modN
        };
        return {
            CURVE: t,
            curveOpts: r,
            ecdsaOpts: n
        };
    }
    function r0(e, t) {
        return Object.assign({}, t, {
            ProjectivePoint: t.Point,
            CURVE: e
        });
    }
    function n0(e) {
        const { CURVE: t, curveOpts: r, ecdsaOpts: n } = t0(e), i = Qh(t, r), o = Xh(i, n, r);
        return r0(e, o);
    }
    function kr(e, t) {
        const r = (n)=>n0({
                ...e,
                hash: n
            });
        return {
            ...r(t),
            create: r
        };
    }
    const Ci = {
        p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
        n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
        h: BigInt(1),
        a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
        b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
        Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
        Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
    }, Pi = {
        p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
        n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
        h: BigInt(1),
        a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
        b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
        Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
        Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
    }, ji = {
        p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
        n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
        h: BigInt(1),
        a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
        b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
        Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
        Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
    }, o0 = dt(Ci.p), i0 = dt(Pi.p), s0 = dt(ji.p);
    kr({
        ...Ci,
        Fp: o0,
        lowS: !1
    }, Ku);
    kr({
        ...Pi,
        Fp: i0,
        lowS: !1
    }, Yu), kr({
        ...ji,
        Fp: s0,
        lowS: !1,
        allowedPrivateKeyLengths: [
            130,
            131,
            132
        ]
    }, $u);
    var f0 = {}, Be = {}, ho;
    function a0() {
        if (ho) return Be;
        ho = 1, Object.defineProperty(Be, "__esModule", {
            value: !0
        }), Be.isBrowserCryptoAvailable = Be.getSubtleCrypto = Be.getBrowerCrypto = void 0;
        function e() {
            return (tt === null || tt === void 0 ? void 0 : tt.crypto) || (tt === null || tt === void 0 ? void 0 : tt.msCrypto) || {};
        }
        Be.getBrowerCrypto = e;
        function t() {
            const n = e();
            return n.subtle || n.webkitSubtle;
        }
        Be.getSubtleCrypto = t;
        function r() {
            return !!e() && !!t();
        }
        return Be.isBrowserCryptoAvailable = r, Be;
    }
    var Ue = {}, po;
    function c0() {
        if (po) return Ue;
        po = 1, Object.defineProperty(Ue, "__esModule", {
            value: !0
        }), Ue.isBrowser = Ue.isNode = Ue.isReactNative = void 0;
        function e() {
            return typeof document > "u" && typeof navigator < "u" && navigator.product === "ReactNative";
        }
        Ue.isReactNative = e;
        function t() {
            return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
        }
        Ue.isNode = t;
        function r() {
            return !e() && !t();
        }
        return Ue.isBrowser = r, Ue;
    }
    (function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        const t = It;
        t.__exportStar(a0(), e), t.__exportStar(c0(), e);
    })(f0);
    const l0 = ()=>typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require("ws");
    l0();
    K.ONE_DAY;
    K.SIX_HOURS;
    K.ONE_DAY, K.ONE_DAY, K.THIRTY_SECONDS, K.THIRTY_SECONDS, K.ONE_DAY, K.ONE_DAY;
    function u0(e, t) {
        if (e.length >= 255) throw new TypeError("Alphabet too long");
        for(var r = new Uint8Array(256), n = 0; n < r.length; n++)r[n] = 255;
        for(var i = 0; i < e.length; i++){
            var o = e.charAt(i), s = o.charCodeAt(0);
            if (r[s] !== 255) throw new TypeError(o + " is ambiguous");
            r[s] = i;
        }
        var f = e.length, c = e.charAt(0), l = Math.log(f) / Math.log(256), a = Math.log(256) / Math.log(f);
        function u(h) {
            if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
            if (h.length === 0) return "";
            for(var b = 0, m = 0, L = 0, E = h.length; L !== E && h[L] === 0;)L++, b++;
            for(var S = (E - L) * a + 1 >>> 0, N = new Uint8Array(S); L !== E;){
                for(var T = h[L], M = 0, j = S - 1; (T !== 0 || M < m) && j !== -1; j--, M++)T += 256 * N[j] >>> 0, N[j] = T % f >>> 0, T = T / f >>> 0;
                if (T !== 0) throw new Error("Non-zero carry");
                m = M, L++;
            }
            for(var I = S - m; I !== S && N[I] === 0;)I++;
            for(var g = c.repeat(b); I < S; ++I)g += e.charAt(N[I]);
            return g;
        }
        function d(h) {
            if (typeof h != "string") throw new TypeError("Expected String");
            if (h.length === 0) return new Uint8Array;
            var b = 0;
            if (h[b] !== " ") {
                for(var m = 0, L = 0; h[b] === c;)m++, b++;
                for(var E = (h.length - b) * l + 1 >>> 0, S = new Uint8Array(E); h[b];){
                    var N = r[h.charCodeAt(b)];
                    if (N === 255) return;
                    for(var T = 0, M = E - 1; (N !== 0 || T < L) && M !== -1; M--, T++)N += f * S[M] >>> 0, S[M] = N % 256 >>> 0, N = N / 256 >>> 0;
                    if (N !== 0) throw new Error("Non-zero carry");
                    L = T, b++;
                }
                if (h[b] !== " ") {
                    for(var j = E - L; j !== E && S[j] === 0;)j++;
                    for(var I = new Uint8Array(m + (E - j)), g = m; j !== E;)I[g++] = S[j++];
                    return I;
                }
            }
        }
        function p(h) {
            var b = d(h);
            if (b) return b;
            throw new Error(`Non-${t} character`);
        }
        return {
            encode: u,
            decodeUnsafe: d,
            decode: p
        };
    }
    var h0 = u0, d0 = h0;
    const Ri = (e)=>{
        if (e instanceof Uint8Array && e.constructor.name === "Uint8Array") return e;
        if (e instanceof ArrayBuffer) return new Uint8Array(e);
        if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
        throw new Error("Unknown type, must be binary type");
    }, p0 = (e)=>new TextEncoder().encode(e), b0 = (e)=>new TextDecoder().decode(e);
    class g0 {
        constructor(t, r, n){
            this.name = t, this.prefix = r, this.baseEncode = n;
        }
        encode(t) {
            if (t instanceof Uint8Array) return `${this.prefix}${this.baseEncode(t)}`;
            throw Error("Unknown type, must be binary type");
        }
    }
    class y0 {
        constructor(t, r, n){
            if (this.name = t, this.prefix = r, r.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
            this.prefixCodePoint = r.codePointAt(0), this.baseDecode = n;
        }
        decode(t) {
            if (typeof t == "string") {
                if (t.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
                return this.baseDecode(t.slice(this.prefix.length));
            } else throw Error("Can only multibase decode strings");
        }
        or(t) {
            return zi(this, t);
        }
    }
    class w0 {
        constructor(t){
            this.decoders = t;
        }
        or(t) {
            return zi(this, t);
        }
        decode(t) {
            const r = t[0], n = this.decoders[r];
            if (n) return n.decode(t);
            throw RangeError(`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
    }
    const zi = (e, t)=>new w0({
            ...e.decoders || {
                [e.prefix]: e
            },
            ...t.decoders || {
                [t.prefix]: t
            }
        });
    class m0 {
        constructor(t, r, n, i){
            this.name = t, this.prefix = r, this.baseEncode = n, this.baseDecode = i, this.encoder = new g0(t, r, n), this.decoder = new y0(t, r, i);
        }
        encode(t) {
            return this.encoder.encode(t);
        }
        decode(t) {
            return this.decoder.decode(t);
        }
    }
    const sr = ({ name: e, prefix: t, encode: r, decode: n })=>new m0(e, t, r, n), Pt = ({ prefix: e, name: t, alphabet: r })=>{
        const { encode: n, decode: i } = d0(r, t);
        return sr({
            prefix: e,
            name: t,
            encode: n,
            decode: (o)=>Ri(i(o))
        });
    }, v0 = (e, t, r, n)=>{
        const i = {};
        for(let a = 0; a < t.length; ++a)i[t[a]] = a;
        let o = e.length;
        for(; e[o - 1] === "=";)--o;
        const s = new Uint8Array(o * r / 8 | 0);
        let f = 0, c = 0, l = 0;
        for(let a = 0; a < o; ++a){
            const u = i[e[a]];
            if (u === void 0) throw new SyntaxError(`Non-${n} character`);
            c = c << r | u, f += r, f >= 8 && (f -= 8, s[l++] = 255 & c >> f);
        }
        if (f >= r || 255 & c << 8 - f) throw new SyntaxError("Unexpected end of data");
        return s;
    }, x0 = (e, t, r)=>{
        const n = t[t.length - 1] === "=", i = (1 << r) - 1;
        let o = "", s = 0, f = 0;
        for(let c = 0; c < e.length; ++c)for(f = f << 8 | e[c], s += 8; s > r;)s -= r, o += t[i & f >> s];
        if (s && (o += t[i & f << r - s]), n) for(; o.length * r & 7;)o += "=";
        return o;
    }, se = ({ name: e, prefix: t, bitsPerChar: r, alphabet: n })=>sr({
            prefix: t,
            name: e,
            encode (i) {
                return x0(i, n, r);
            },
            decode (i) {
                return v0(i, n, r, e);
            }
        }), E0 = sr({
        prefix: "\0",
        name: "identity",
        encode: (e)=>b0(e),
        decode: (e)=>p0(e)
    });
    var A0 = Object.freeze({
        __proto__: null,
        identity: E0
    });
    const _0 = se({
        prefix: "0",
        name: "base2",
        alphabet: "01",
        bitsPerChar: 1
    });
    var O0 = Object.freeze({
        __proto__: null,
        base2: _0
    });
    const S0 = se({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3
    });
    var B0 = Object.freeze({
        __proto__: null,
        base8: S0
    });
    const U0 = Pt({
        prefix: "9",
        name: "base10",
        alphabet: "0123456789"
    });
    var N0 = Object.freeze({
        __proto__: null,
        base10: U0
    });
    const I0 = se({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4
    }), L0 = se({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4
    });
    var T0 = Object.freeze({
        __proto__: null,
        base16: I0,
        base16upper: L0
    });
    const C0 = se({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5
    }), P0 = se({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5
    }), j0 = se({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5
    }), R0 = se({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5
    }), z0 = se({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5
    }), k0 = se({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5
    }), M0 = se({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5
    }), H0 = se({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5
    }), F0 = se({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5
    });
    var D0 = Object.freeze({
        __proto__: null,
        base32: C0,
        base32upper: P0,
        base32pad: j0,
        base32padupper: R0,
        base32hex: z0,
        base32hexupper: k0,
        base32hexpad: M0,
        base32hexpadupper: H0,
        base32z: F0
    });
    const q0 = Pt({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
    }), V0 = Pt({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    });
    var K0 = Object.freeze({
        __proto__: null,
        base36: q0,
        base36upper: V0
    });
    const $0 = Pt({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    }), Y0 = Pt({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    });
    var G0 = Object.freeze({
        __proto__: null,
        base58btc: $0,
        base58flickr: Y0
    });
    const W0 = se({
        prefix: "m",
        name: "base64",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6
    }), Z0 = se({
        prefix: "M",
        name: "base64pad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6
    }), J0 = se({
        prefix: "u",
        name: "base64url",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6
    }), Q0 = se({
        prefix: "U",
        name: "base64urlpad",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6
    });
    var X0 = Object.freeze({
        __proto__: null,
        base64: W0,
        base64pad: Z0,
        base64url: J0,
        base64urlpad: Q0
    });
    const ki = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), ed = ki.reduce((e, t, r)=>(e[r] = t, e), []), td = ki.reduce((e, t, r)=>(e[t.codePointAt(0)] = r, e), []);
    function rd(e) {
        return e.reduce((t, r)=>(t += ed[r], t), "");
    }
    function nd(e) {
        const t = [];
        for (const r of e){
            const n = td[r.codePointAt(0)];
            if (n === void 0) throw new Error(`Non-base256emoji character: ${r}`);
            t.push(n);
        }
        return new Uint8Array(t);
    }
    const od = sr({
        prefix: "🚀",
        name: "base256emoji",
        encode: rd,
        decode: nd
    });
    var id = Object.freeze({
        __proto__: null,
        base256emoji: od
    }), sd = Mi, bo = 128, fd = -128, ad = Math.pow(2, 31);
    function Mi(e, t, r) {
        t = t || [], r = r || 0;
        for(var n = r; e >= ad;)t[r++] = e & 255 | bo, e /= 128;
        for(; e & fd;)t[r++] = e & 255 | bo, e >>>= 7;
        return t[r] = e | 0, Mi.bytes = r - n + 1, t;
    }
    var cd = Mr, ld = 128, go = 127;
    function Mr(e, n) {
        var r = 0, n = n || 0, i = 0, o = n, s, f = e.length;
        do {
            if (o >= f) throw Mr.bytes = 0, new RangeError("Could not decode varint");
            s = e[o++], r += i < 28 ? (s & go) << i : (s & go) * Math.pow(2, i), i += 7;
        }while (s >= ld);
        return Mr.bytes = o - n, r;
    }
    var ud = Math.pow(2, 7), hd = Math.pow(2, 14), dd = Math.pow(2, 21), pd = Math.pow(2, 28), bd = Math.pow(2, 35), gd = Math.pow(2, 42), yd = Math.pow(2, 49), wd = Math.pow(2, 56), md = Math.pow(2, 63), vd = function(e) {
        return e < ud ? 1 : e < hd ? 2 : e < dd ? 3 : e < pd ? 4 : e < bd ? 5 : e < gd ? 6 : e < yd ? 7 : e < wd ? 8 : e < md ? 9 : 10;
    }, xd = {
        encode: sd,
        decode: cd,
        encodingLength: vd
    }, Hi = xd;
    const yo = (e, t, r = 0)=>(Hi.encode(e, t, r), t), wo = (e)=>Hi.encodingLength(e), Hr = (e, t)=>{
        const r = t.byteLength, n = wo(e), i = n + wo(r), o = new Uint8Array(i + r);
        return yo(e, o, 0), yo(r, o, n), o.set(t, i), new Ed(e, r, t, o);
    };
    class Ed {
        constructor(t, r, n, i){
            this.code = t, this.size = r, this.digest = n, this.bytes = i;
        }
    }
    const Fi = ({ name: e, code: t, encode: r })=>new Ad(e, t, r);
    class Ad {
        constructor(t, r, n){
            this.name = t, this.code = r, this.encode = n;
        }
        digest(t) {
            if (t instanceof Uint8Array) {
                const r = this.encode(t);
                return r instanceof Uint8Array ? Hr(this.code, r) : r.then((n)=>Hr(this.code, n));
            } else throw Error("Unknown type, must be binary type");
        }
    }
    const Di = (e)=>async (t)=>new Uint8Array(await crypto.subtle.digest(e, t)), _d = Fi({
        name: "sha2-256",
        code: 18,
        encode: Di("SHA-256")
    }), Od = Fi({
        name: "sha2-512",
        code: 19,
        encode: Di("SHA-512")
    });
    var Sd = Object.freeze({
        __proto__: null,
        sha256: _d,
        sha512: Od
    });
    const qi = 0, Bd = "identity", Vi = Ri, Ud = (e)=>Hr(qi, Vi(e)), Nd = {
        code: qi,
        name: Bd,
        encode: Vi,
        digest: Ud
    };
    var Id = Object.freeze({
        __proto__: null,
        identity: Nd
    });
    new TextEncoder, new TextDecoder;
    ({
        ...A0,
        ...O0,
        ...B0,
        ...N0,
        ...T0,
        ...D0,
        ...K0,
        ...G0,
        ...X0,
        ...id
    });
    ({
        ...Sd,
        ...Id
    });
    K.SEVEN_DAYS;
    K.FIVE_MINUTES, K.FIVE_MINUTES, K.FIVE_MINUTES, K.FIVE_MINUTES, K.FIVE_MINUTES, K.FIVE_MINUTES, K.ONE_DAY, K.ONE_DAY, K.ONE_DAY, K.ONE_DAY, K.FIVE_MINUTES, K.FIVE_MINUTES, K.FIVE_MINUTES, K.FIVE_MINUTES, K.ONE_DAY, K.ONE_DAY, K.ONE_DAY, K.ONE_DAY, K.ONE_HOUR, K.ONE_HOUR, K.FIVE_MINUTES, K.FIVE_MINUTES;
    K.FIVE_MINUTES, K.SEVEN_DAYS;
    const Er = es(), Ld = {
        width: "245px",
        height: "245px",
        borderRadius: "40px",
        zIndex: "99999",
        backgroundColor: "white",
        border: "none",
        outline: "none"
    }, Td = `
  <div id="argent-mobile-modal-container" style="position: relative; display: flex; justify-content: center; align-items: center">
    <iframe class="argent-iframe" allow="clipboard-write"></iframe>
  </div>
`;
    class Cd {
        constructor(){
            Ce(this, "bridgeUrl", "https://login.ready.co"), Ce(this, "mobileUrl", "ready://"), Ce(this, "type", "overlay"), Ce(this, "wcUri"), Ce(this, "overlay"), Ce(this, "popupWindow"), Ce(this, "closingTimeout"), Ce(this, "standaloneConnectorModal");
        }
        showWalletConnectModal(t, r) {
            const n = encodeURIComponent(t), i = encodeURIComponent(window.location.href);
            this.showModal({
                desktop: `${this.bridgeUrl}?wc=${n}&href=${i}&device=desktop&onlyQR=true`,
                ios: `${this.mobileUrl}app/wc?uri=${n}&href=${i}&device=mobile&onlyQR=true`,
                android: `${this.mobileUrl}app/wc?uri=${n}&href=${i}&device=mobile&onlyQR=true`
            }, r);
        }
        getWalletConnectQR(t) {
            const r = encodeURIComponent(t), n = encodeURIComponent(window.location.href);
            this.getQR({
                desktop: `${this.bridgeUrl}?wc=${r}&href=${n}&device=desktop&onlyQR=true`,
                ios: `${this.mobileUrl}app/wc?uri=${r}&href=${n}&device=mobile&onlyQR=true`,
                android: `${this.mobileUrl}app/wc?uri=${r}&href=${n}&device=mobile&onlyQR=true`
            });
        }
        openMobileApp(t) {
            const r = document.createElement("button");
            r.style.display = "none", r.addEventListener("click", ()=>{
                window.location.href = t[Er];
            }), r.click();
        }
        getQR(t) {
            if ([
                "android",
                "ios"
            ].includes(Er)) {
                this.openMobileApp(t);
                return;
            }
            const r = document.createElement("div"), n = document.querySelector("#starknetkit-modal-container");
            if (n?.shadowRoot) {
                const i = n.shadowRoot.querySelector(".qr-code-slot");
                if (i) {
                    i.innerHTML = Td, document.body.appendChild(r), this.overlay = r;
                    const o = i.querySelector("iframe");
                    o.setAttribute("src", t.desktop);
                    for (const [s, f] of Object.entries(Ld))o.style[s] = f;
                } else throw new Error("Cannot find QR code slot");
            } else throw new Error("Cannot find modal");
        }
        showApprovalModal(t) {
            const r = encodeURIComponent(window.location.href), n = {
                desktop: `${this.bridgeUrl}?action=sign&device=desktop&href=${r}`,
                ios: `${this.mobileUrl}app/wc/request?href=${r}&device=mobile`,
                android: `${this.mobileUrl}app/wc/request?href=${r}&device=mobile`
            };
            if (!rs()) {
                if (this.getModal(void 0, Ge.approval), [
                    "android",
                    "ios"
                ].includes(Er)) {
                    this.openMobileApp(n);
                    return;
                }
                return;
            }
            this.showModal(n, void 0);
        }
        closeModal({ success: t, isRequest: r } = {
            success: !1,
            isRequest: !1
        }) {
            const n = this.standaloneConnectorModal;
            t ? (n?.$set({
                layout: Ge.success
            }), setTimeout(()=>n?.$destroy(), 500)) : r ? (n?.$set({
                layout: Ge.requestFailure
            }), setTimeout(()=>n?.$destroy(), 500)) : n?.$set({
                layout: Ge.loginFailure
            });
        }
        getModal(t, r = Ge.qrCode) {
            this.standaloneConnectorModal = new ns({
                target: os(),
                props: {
                    layout: r,
                    dappName: t?.dappName,
                    showBackButton: !1,
                    selectedWallet: t,
                    callback: async (n)=>{
                        try {
                            const i = n?.connector;
                            this.standaloneConnectorModal?.$destroy(), await i?.connect();
                        } catch  {
                            this.standaloneConnectorModal?.$set({
                                layout: Ge.loginFailure
                            });
                        }
                    }
                }
            });
        }
        showModal(t, r) {
            this.getModal(r, Ge.qrCode), this.getQR(t);
        }
    }
    new Cd;
    ts.NetworkName;
});
