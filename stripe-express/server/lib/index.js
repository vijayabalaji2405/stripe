"use strict";
// s environment variables file. In simple term, it is a variable text file. In this file we set a variable with value and that you wouldn’t want to share with anyone, purpose of file is keep as secret and secure because in .env file we store our database password, username, API key etc…
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const dotenv_1 = require("dotenv");
if (process.env.NODE_ENV !== "production") {
    dotenv_1.config();
}
// Initialize Stripe
const stripe_1 = __importDefault(require("stripe"));
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    apiVersion: "2020-08-27",
});
// Start the API with Express
const api_1 = require("./api");
const port = 2222;
api_1.app.listen(port, () => console.log(`API available on http://localhost:${port}`));
//# sourceMappingURL=index.js.map