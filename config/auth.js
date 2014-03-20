/* 
 * The MIT License
 *
 * Copyright 2014 Bertold von Dormilich <Dormilich@netscape.net>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

module.exports = {
	"googleAuth" : {
		"clientID"     : process.env.AUTH_GOOGLE_ID,
		"clientSecret" : process.env.AUTH_GOOGLE_SECRET,
		"callbackURL"  : process.env.AUTH_GOOGLE_URL
	},
	"facebookAuth" : {
		"clientID"     : process.env.AUTH_FACEBOOK_ID,
		"clientSecret" : process.env.AUTH_FACEBOOK_SECRET,
		"callbackURL"  : process.env.AUTH_FACEBOOK_URL
	},
	"reCaptcha" : {
		"private_key" : process.env.AUTH_RECAPTCHA_KEY_PRIVATE,
		"public_key"  : process.env.AUTH_RECAPTCHA_KEY_PUBLIC
	}
};