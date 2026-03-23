module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/tasks.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
let tasks = [];
function handler(req, res) {
    if (req.method === 'GET') {
        const { ownerAgent, status, planId } = req.query;
        let filtered = tasks;
        if (ownerAgent) filtered = filtered.filter((t)=>t.ownerAgent === ownerAgent);
        if (status) filtered = filtered.filter((t)=>t.status === status);
        if (planId) filtered = filtered.filter((t)=>t.planId === planId);
        return res.status(200).json(filtered);
    }
    if (req.method === 'POST') {
        const task = req.body;
        if (!task?.id) return res.status(400).json({
            error: 'Task id is required'
        });
        const now = new Date().toISOString();
        tasks.push({
            ...task,
            createdAt: task.createdAt || now,
            updatedAt: now
        });
        return res.status(201).json(task);
    }
    res.setHeader('Allow', [
        'GET',
        'POST'
    ]);
    return res.status(405).end('Method Not Allowed');
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00j5nnx._.js.map