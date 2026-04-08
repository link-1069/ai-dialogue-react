import { useEffect as e, useRef as t, useState as n } from "react";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
//#region registry/dialogue-box/dialogue-box.tsx
var o = [
	".dlg-no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}",
	".dlg-no-scrollbar::-webkit-scrollbar{display:none}",
	"@keyframes dlg-slide-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}",
	".dlg-slide-in-up{animation:.5s ease-out forwards dlg-slide-in-up}"
].join("");
function s() {
	e(() => {
		if (typeof document > "u") return;
		let e = "__dialogue-box-styles__";
		if (document.getElementById(e)) return;
		let t = document.createElement("style");
		t.id = e, t.textContent = o, document.head.appendChild(t);
	}, []);
}
var c = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"16\" fill=\"%234A90D9\"/><circle cx=\"64\" cy=\"48\" r=\"24\" fill=\"white\"/><ellipse cx=\"64\" cy=\"100\" rx=\"36\" ry=\"22\" fill=\"white\"/></svg>", l = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"16\" fill=\"%23A855F7\"/><circle cx=\"64\" cy=\"48\" r=\"24\" fill=\"white\"/><ellipse cx=\"64\" cy=\"100\" rx=\"36\" ry=\"22\" fill=\"white\"/></svg>";
function u(e, t) {
	return e ? {
		backgroundImage: `url(${e})`,
		backgroundSize: "100% 100%"
	} : { background: t };
}
function d(...e) {
	return e.filter(Boolean).join(" ");
}
function f({ text: a, speed: o = 40 }) {
	let [s, c] = n(""), l = t({
		target: a,
		pos: 0
	});
	return e(() => {
		let e = l.current;
		a !== e.target && (a.startsWith(e.target) ? e.target = a : (l.current = {
			target: a,
			pos: 0
		}, c("")));
	}, [a]), e(() => {
		let e = l.current;
		if (e.pos >= e.target.length) return;
		let t = setTimeout(() => {
			e.pos += 1, c(e.target.slice(0, e.pos));
		}, o);
		return () => clearTimeout(t);
	}, [s, o]), /* @__PURE__ */ i(r, { children: s });
}
function p({ messages: r, partialText: o = "", aiPartialText: p = "", language: m = "zh", userAvatarUrl: h = c, aiAvatarUrl: g = l, userBubbleBgUrl: _, aiBubbleBgUrl: v, aiBubbleBgLongUrl: y, typewriterSpeed: b = 40, className: x, style: S, avatarClassName: C, avatarStyle: w, nameClassName: T, nameStyle: E, userBubbleClassName: D, userBubbleStyle: O, aiBubbleClassName: k, aiBubbleStyle: A, partialTextColor: j = "#ffd54f" }) {
	s();
	let M = t(null), N = t(r), P = t(o), F = t(p), [I, L] = n(/* @__PURE__ */ new Set());
	e(() => {
		M.current?.scrollTo({
			top: M.current.scrollHeight,
			behavior: "smooth"
		});
	}, [
		r,
		o,
		p
	]), e(() => {
		let e = N.current, t = P.current, n = F.current;
		if (r.length > e.length) {
			let i = r.slice(e.length), a = [];
			if (t && !o) {
				let e = i.find((e) => e.type === "user" && e.content === t);
				e && a.push(e.id);
			}
			if (n && !p) {
				let e = i.find((e) => e.type === "ai" && e.content === n);
				e && a.push(e.id);
			}
			a.length > 0 && L((e) => {
				let t = new Set(e);
				return a.forEach((e) => t.add(e)), t;
			});
		}
		N.current = r, P.current = o, F.current = p;
	}, [
		r,
		o,
		p
	]);
	let R = r.length + +!!o, z = d("relative flex h-[653px] w-[1000px] flex-col gap-10 overflow-y-auto dlg-no-scrollbar", x), B = {
		user: m === "zh" ? "用户" : "User",
		ai: m === "zh" ? "AI助理" : "AI Assistant",
		userLive: m === "zh" ? "用户(实时)" : "User (Real-time)",
		aiLive: m === "zh" ? "AI助理(实时)" : "AI Assistant (Real-time)"
	}, V = d("w-32 h-32 rounded-2xl shrink-0 bg-gray-300", C), H = d("ml-5 text-[40px] text-[#213140]", T), U = d("p-10.5 min-h-32 text-[40px] leading-tight", D), W = d("p-10.5 min-h-32 text-[40px] leading-tight flex items-center", k);
	return /* @__PURE__ */ a("div", {
		ref: M,
		className: z,
		style: S,
		children: [
			r.map((e, t) => {
				let n = t < R - 3, r = t === R - 3, o = t === R - 1, s = e.type === "user";
				return /* @__PURE__ */ a("div", {
					className: d("flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0", n ? "opacity-0" : r ? "opacity-50" : "opacity-100", o ? "dlg-slide-in-up" : ""),
					children: [/* @__PURE__ */ i("div", {
						className: V,
						style: {
							backgroundImage: `url(${s ? h : g})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							...w
						}
					}), /* @__PURE__ */ a("div", {
						className: "flex max-w-[80%] flex-col items-start gap-2",
						children: [/* @__PURE__ */ i("div", {
							className: H,
							style: E,
							children: e.name || (s ? B.user : B.ai)
						}), /* @__PURE__ */ i("div", {
							className: s ? U : W,
							style: {
								...u(s ? _ : e.content.length <= 5 ? v : y, s ? "#4A90D9" : "#E8E8E8"),
								color: s ? "#FFFFFF" : "#000",
								...s ? O : A
							},
							children: I.has(e.id) ? e.content : /* @__PURE__ */ i(f, {
								text: e.content,
								speed: b
							}, e.id)
						})]
					})]
				}, e.id);
			}),
			o && /* @__PURE__ */ a("div", {
				className: "flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 opacity-100 dlg-slide-in-up",
				children: [/* @__PURE__ */ i("div", {
					className: V,
					style: {
						backgroundImage: `url(${h})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						...w
					}
				}), /* @__PURE__ */ a("div", {
					className: "flex max-w-[80%] flex-col items-start gap-2",
					children: [/* @__PURE__ */ i("div", {
						className: H,
						style: E,
						children: B.userLive
					}), /* @__PURE__ */ i("div", {
						className: U,
						style: {
							...u(_, "#4A90D9"),
							color: "#FFFFFF",
							...O
						},
						children: /* @__PURE__ */ i("div", {
							style: { color: j },
							children: /* @__PURE__ */ i(f, {
								text: o,
								speed: b
							})
						})
					})]
				})]
			}),
			p && /* @__PURE__ */ a("div", {
				className: "flex gap-4 w-full transition-opacity duration-500 ease-out shrink-0 opacity-100 dlg-slide-in-up",
				children: [/* @__PURE__ */ i("div", {
					className: V,
					style: {
						backgroundImage: `url(${g})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						...w
					}
				}), /* @__PURE__ */ a("div", {
					className: "flex max-w-[80%] flex-col items-start gap-2",
					children: [/* @__PURE__ */ i("div", {
						className: H,
						style: E,
						children: B.aiLive
					}), /* @__PURE__ */ i("div", {
						className: W,
						style: {
							...u(p.length <= 5 ? v : y, "#E8E8E8"),
							color: "#000",
							...A
						},
						children: /* @__PURE__ */ i("div", {
							style: { color: j },
							children: /* @__PURE__ */ i(f, {
								text: p,
								speed: b
							})
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { p as DialogueBox };
