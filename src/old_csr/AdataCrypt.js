class AdataCrypt {
    /**
     * SHA1 (Secure Hash Algorithm 1)
     * @param {string|number} input Input string or number
     * @returns Output hash
     */
    static sha1(input) {
        function rotate_left(n, s) {
            return (n << s) | (n >>> (32 - s));
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var r = "";
            for(var n = 0;n < string.length;n++) {
                var c = string.charCodeAt(n);
                if(c < 128)
                    r += String.fromCharCode(c);
                else if((c > 127) && (c < 2048)) {
                    r += String.fromCharCode((c >> 6) | 192);
                    r += String.fromCharCode((c & 63) | 128);
                } else {
                    r += String.fromCharCode((c >> 12) | 224);
                    r += String.fromCharCode(((c >> 6) & 63) | 128);
                    r += String.fromCharCode((c & 63) | 128);
                }
            }
            return r;
        }

        var blockstart, A, B, C, D, E, temp;
        var W = new Array(80),
            h = [
                0x67452301,
                0xEFCDAB89,
                0x98BADCFE,
                0x10325476,
                0xC3D2E1F0
            ];
        input = Utf8Encode(input);
        var input_len = input.length, word_array = new Array();

        for(var i = 0;i < input_len - 3;i += 4)
            word_array.push(input.charCodeAt(i) << 24 | input.charCodeAt(i + 1) << 16 | input.charCodeAt(i + 2) << 8 | input.charCodeAt(i + 3));

        switch(input_len % 4) {
            case 0:
                i = 0x080000000;
            break;
            case 1:
                i = input.charCodeAt(input_len - 1) << 24 | 0x0800000;
            break;
            case 2:
                i = input.charCodeAt(input_len - 2) << 24 | input.charCodeAt(input_len - 1) << 16 | 0x08000;
            break;
            case 3:
                i = input.charCodeAt(input_len - 3) << 24 | input.charCodeAt(input_len - 2) << 16 | input.charCodeAt(input_len - 1) << 8 | 0x80;
            break;
        }

        word_array.push(i);
        while((word_array.length % 16) != 14) word_array.push(0);
        word_array.push(input_len >>> 29);
        word_array.push((input_len << 3) & 0x0ffffffff);

        for(blockstart = 0;blockstart < word_array.length;blockstart += 16) {
            for(i = 0;i < 16;i++) W[i] = word_array[blockstart + i];
            for(i = 16;i <= 79;i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            
            A = h[0],
            B = h[1],
            C = h[2],
            D = h[3],
            E = h[4];

            for(i = 0;i <= 19;i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff,
                E = D,
                D = C,
                C = rotate_left(B, 30),
                B = A,
                A = temp;
            }

            for(i = 20;i <= 39;i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff,
                E = D,
                D = C,
                C = rotate_left(B, 30),
                B = A,
                A = temp;
            }

            for(i = 40;i <= 59;i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff,
                E = D,
                D = C,
                C = rotate_left(B, 30),
                B = A,
                A = temp;
            }

            for(i = 60;i <= 79;i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff,
                E = D,
                D = C,
                C = rotate_left(B, 30),
                B = A,
                A = temp;
            }

            h[0] = (h[0] + A) & 0x0ffffffff;
            h[1] = (h[1] + B) & 0x0ffffffff;
            h[2] = (h[2] + C) & 0x0ffffffff;
            h[3] = (h[3] + D) & 0x0ffffffff;
            h[4] = (h[4] + E) & 0x0ffffffff;
        }

        var output = '';
        for(var i = 0;i < 5;i++)
            for(var j = 7;j >= 0;j--)
                output += ((h[i] >>> (j * 4)) & 0x0f).toString(16);
        return output.toLowerCase();
    }

    /**
     * SHA256 (Secure Hash Algorithm 256)
     * @param {string|number} input Input string or number
     * @returns Output hash
     */
    static sha256(input) {
        function r(v, a) {
            return (v >>> a) | (v << (32 - a));
        }

        var i, j, words = [], hash = [], k = [], isComposite = {}, output = '';
        var inputBitLength = input.length * 8;
        var pC = k.length;
        var maxWord = Math.pow(2, 32);

        for(var ca = 2;pC < 64;ca++)
            if(!isComposite[ca]) {
                for(i = 0;i < 313;i += ca)
                    isComposite[i] = ca;
                hash[pC] = (Math.pow(ca, .5) * maxWord) | 0;
                k[pC++] = (Math.pow(ca, 1/3) * maxWord) | 0;
            }

        input += '\x80';
        while(input.length % 64 - 56) input += '\x00';
        for(i = 0;i < input.length;i++) {
            j = input.charCodeAt(i);
            if(j >> 8) return;
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }

        words[words.length] = ((inputBitLength / maxWord) | 0);
        words[words.length] = (inputBitLength);

        for(j = 0;j < words.length;) {
            var w = words.slice(j, j += 16);
            var oldHash = hash;
            hash = hash.slice(0, 8);
            for(i = 0;i < 64;i++) {
                var a = hash[0],
                    b = w[i - 15],
                    c = w[i - 2],
                    e = hash[4];
                var temp1 = hash[7] + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (r(b, 7) ^ r(b, 18) ^ (b >>> 3)) + w[i - 7] + (r(c, 17) ^ r(c, 19) ^ (c >>> 10))) | 0);

                hash = [(temp1 + (r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
            for(i = 0;i < 8;i++)
                hash[i] = (hash[i] + oldHash[i]) | 0;
        }
        for(i = 0;i < 8;i++)
            for(j = 3;j + 1;j--) {
                var b = (hash[i] >> (j * 8)) & 255;
                output += ((b < 16) ? 0 : '') + b.toString(16);
            }
        return output;
    }

    /**
     * SHA512 (Secure Hash Algorithm 512)
     * @param {string|number} input Input string or number
     * @returns Output hash
     */
    static sha512(str) {
        function int64(msint_32, lsint_32) {
            this.highOrder = msint_32;
            this.lowOrder = lsint_32;
        }
    
        var H = [
            new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
            new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
            new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
            new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)
        ], K = [
            new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
            new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
            new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
            new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
            new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
            new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
            new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
            new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
            new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
            new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
            new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
            new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
            new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
            new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
            new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
            new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
            new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
            new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
            new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
            new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
            new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
            new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
            new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
            new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
            new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
            new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
            new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
            new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
            new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
            new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
            new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
            new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
            new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
            new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
            new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
            new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
            new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
            new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
            new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
            new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
        ],
        charsize = 8,
        W = new Array(64),
        a, b, c, d, e, f, g, h, i, j, T1, T2;
    
        function safe_add_2(x, y) {
            var lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
            var msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
            var lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
            lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
            var highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
            return new int64(highOrder, lowOrder);
        }
    
        function safe_add_4(a, b, c, d) {
            var lsw, msw, lowOrder, highOrder;
            var lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
            var msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
            var lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
            lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
            var highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
            return new int64(highOrder, lowOrder);
        }
    
        function safe_add_5(a, b, c, d, e) {
            var lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
            var msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
            var lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
            lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
            var highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
            return new int64(highOrder, lowOrder);
        }
    
        function maj(x, y, z) {
            return new int64((x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder), (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder));
        }
    
        function ch(x, y, z) {
            return new int64((x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder), (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder));
        }
    
        function rotr(x, n) {
            if(n <= 32)
                return new int64((x.highOrder >>> n) | (x.lowOrder << (32 - n)), (x.lowOrder >>> n) | (x.highOrder << (32 - n)));
            else
                return new int64((x.lowOrder >>> n) | (x.highOrder << (32 - n)), (x.highOrder >>> n) | (x.lowOrder << (32 - n)));
        }
    
        function sigma0(x) {
            var rotr28 = rotr(x, 28);
            var rotr34 = rotr(x, 34);
            var rotr39 = rotr(x, 39);
            return new int64(rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder, rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder);
        }
    
        function sigma1(x) {
            var rotr14 = rotr(x, 14);
            var rotr18 = rotr(x, 18);
            var rotr41 = rotr(x, 41);
            return new int64(rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder, rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder);
        }
    
        function gamma0(x) {
            var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);
            return new int64(rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder, rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder);
        }
    
        function gamma1(x) {
            var rotr19 = rotr(x, 19);
            var rotr61 = rotr(x, 61);
            var shr6 = shr(x, 6);
            return new int64(rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder, rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder);
        }
    
        function shr(x, n) {
            if(n <= 32)
                return new int64(x.highOrder >>> n, x.lowOrder >>> n | (x.highOrder << (32 - n)));
            else
                return new int64(0, x.highOrder << (32 - n));
        }
    
        str = unescape(encodeURIComponent(str));
        var strlen = str.length * charsize;

        var bin = [];
        var mask = (1 << charsize) - 1;
        var len = str.length * charsize;
        for(var i = 0;i < len;i += charsize)
            bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
        str = bin;
    
        str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
        str[(((strlen + 128) >> 10) << 5) + 31] = strlen;
    
        for(var i = 0;i < str.length;i += 32) {
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];
        
            for(var j = 0;j < 80;j++) {
                if(j < 16)
                    W[j] = new int64(str[j * 2 + i], str[j * 2 + i + 1]);
                else
                    W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
        
                T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]),
                T2 = safe_add_2(sigma0(a), maj(a, b, c)),
                h = g,
                g = f,
                f = e,
                e = safe_add_2(d, T1),
                d = c,
                c = b,
                b = a,
                a = safe_add_2(T1, T2);
            }
    
            H[0] = safe_add_2(a, H[0]);
            H[1] = safe_add_2(b, H[1]);
            H[2] = safe_add_2(c, H[2]);
            H[3] = safe_add_2(d, H[3]);
            H[4] = safe_add_2(e, H[4]);
            H[5] = safe_add_2(f, H[5]);
            H[6] = safe_add_2(g, H[6]);
            H[7] = safe_add_2(h, H[7]);
        }
    
        var binarray = [];
        for(var i = 0;i < H.length;i++) {
            binarray.push(H[i].highOrder);
            binarray.push(H[i].lowOrder);
        }

        var hex_tab = '0123456789abcdef',
            str = '',
            length = binarray.length * 4,
            sByte;
        
        for(var i = 0;i < length;i += 1) {
            sByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
            str += hex_tab.charAt((sByte >> 4) & 0xF) + hex_tab.charAt(sByte & 0xF);
        }
        
        return str;
    }
   
    /**
     * MD5 (Message Digest Algorithm 5)
     * @param {string|number} input Input string or number
     * @returns Output hash
     */
    static md5(input) {
        var hexTab = '0123456789abcdef',
            output = [],
            len32 = input.length * 32,
            x, i, iLen;
        input = unescape(encodeURIComponent(input));
        iLen = input.length * 8;
        output[(input.length >> 2) - 1] = undefined;
        for(i = 0;i < output.length;i += 1)
            output[i] = 0;

        var len8 = input.length * 8;
        for(i = 0;i < len8;i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;

        input = output;
        output = '';

        input[iLen >> 5] |= 0x80 << iLen % 32;
        input[(((iLen + 64) >>> 9) << 4) + 14] = iLen;

        var i, olda, oldb, oldc, oldd,
            a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878;

        for(i = 0;i < input.length;i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;
            a = cal(a, b, c, d, input[i], 7, -680876936, 0);
            d = cal(d, a, b, c, input[i + 1], 12, -389564586, 0);
            c = cal(c, d, a, b, input[i + 2], 17, 606105819, 0);
            b = cal(b, c, d, a, input[i + 3], 22, -1044525330, 0);
            a = cal(a, b, c, d, input[i + 4], 7, -176418897, 0);
            d = cal(d, a, b, c, input[i + 5], 12, 1200080426, 0);
            c = cal(c, d, a, b, input[i + 6], 17, -1473231341, 0);
            b = cal(b, c, d, a, input[i + 7], 22, -45705983, 0);
            a = cal(a, b, c, d, input[i + 8], 7, 1770035416, 0);
            d = cal(d, a, b, c, input[i + 9], 12, -1958414417, 0);
            c = cal(c, d, a, b, input[i + 10], 17, -42063, 0);
            b = cal(b, c, d, a, input[i + 11], 22, -1990404162, 0);
            a = cal(a, b, c, d, input[i + 12], 7, 1804603682, 0);
            d = cal(d, a, b, c, input[i + 13], 12, -40341101, 0);
            c = cal(c, d, a, b, input[i + 14], 17, -1502002290, 0);
            b = cal(b, c, d, a, input[i + 15], 22, 1236535329, 0);
            a = cal(a, b, c, d, input[i + 1], 5, -165796510, 1);
            d = cal(d, a, b, c, input[i + 6], 9, -1069501632, 1);
            c = cal(c, d, a, b, input[i + 11], 14, 643717713, 1);
            b = cal(b, c, d, a, input[i], 20, -373897302, 1);
            a = cal(a, b, c, d, input[i + 5], 5, -701558691, 1);
            d = cal(d, a, b, c, input[i + 10], 9, 38016083, 1);
            c = cal(c, d, a, b, input[i + 15], 14, -660478335, 1);
            b = cal(b, c, d, a, input[i + 4], 20, -405537848, 1);
            a = cal(a, b, c, d, input[i + 9], 5, 568446438, 1);
            d = cal(d, a, b, c, input[i + 14], 9, -1019803690, 1);
            c = cal(c, d, a, b, input[i + 3], 14, -187363961, 1);
            b = cal(b, c, d, a, input[i + 8], 20, 1163531501, 1);
            a = cal(a, b, c, d, input[i + 13], 5, -1444681467, 1);
            d = cal(d, a, b, c, input[i + 2], 9, -51403784, 1);
            c = cal(c, d, a, b, input[i + 7], 14, 1735328473, 1);
            b = cal(b, c, d, a, input[i + 12], 20, -1926607734, 1);
            a = cal(a, b, c, d, input[i + 5], 4, -378558, 2);
            d = cal(d, a, b, c, input[i + 8], 11, -2022574463, 2);
            c = cal(c, d, a, b, input[i + 11], 16, 1839030562, 2);
            b = cal(b, c, d, a, input[i + 14], 23, -35309556, 2);
            a = cal(a, b, c, d, input[i + 1], 4, -1530992060, 2);
            d = cal(d, a, b, c, input[i + 4], 11, 1272893353, 2);
            c = cal(c, d, a, b, input[i + 7], 16, -155497632, 2);
            b = cal(b, c, d, a, input[i + 10], 23, -1094730640, 2);
            a = cal(a, b, c, d, input[i + 13], 4, 681279174, 2);
            d = cal(d, a, b, c, input[i], 11, -358537222, 2);
            c = cal(c, d, a, b, input[i + 3], 16, -722521979, 2);
            b = cal(b, c, d, a, input[i + 6], 23, 76029189, 2);
            a = cal(a, b, c, d, input[i + 9], 4, -640364487, 2);
            d = cal(d, a, b, c, input[i + 12], 11, -421815835, 2);
            c = cal(c, d, a, b, input[i + 15], 16, 530742520, 2);
            b = cal(b, c, d, a, input[i + 2], 23, -995338651, 2);
            a = cal(a, b, c, d, input[i], 6, -198630844, 3);
            d = cal(d, a, b, c, input[i + 7], 10, 1126891415, 3);
            c = cal(c, d, a, b, input[i + 14], 15, -1416354905, 3);
            b = cal(b, c, d, a, input[i + 5], 21, -57434055, 3);
            a = cal(a, b, c, d, input[i + 12], 6, 1700485571, 3);
            d = cal(d, a, b, c, input[i + 3], 10, -1894986606, 3);
            c = cal(c, d, a, b, input[i + 10], 15, -1051523, 3);
            b = cal(b, c, d, a, input[i + 1], 21, -2054922799, 3);
            a = cal(a, b, c, d, input[i + 8], 6, 1873313359, 3);
            d = cal(d, a, b, c, input[i + 15], 10, -30611744, 3);
            c = cal(c, d, a, b, input[i + 6], 15, -1560198380, 3);
            b = cal(b, c, d, a, input[i + 13], 21, 1309151649, 3);
            a = cal(a, b, c, d, input[i + 4], 6, -145523070, 3);
            d = cal(d, a, b, c, input[i + 11], 10, -1120210379, 3);
            c = cal(c, d, a, b, input[i + 2], 15, 718787259, 3);
            b = cal(b, c, d, a, input[i + 9], 21, -343485551, 3);
            a = safeAdd(a, olda);
            b = safeAdd(b, oldb);
            c = safeAdd(c, oldc);
            d = safeAdd(d, oldd);
        }
        input = [a, b, c, d];

        for(i = 0;i < len32;i += 8)
            output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);

        input = output;
        output = '';

        for(i = 0;i < input.length;i += 1) {
            x = input.charCodeAt(i);
            output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
        }

        function safeAdd(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }

        function cal(a, b, c, d, x, s, t, n) {
            var num = safeAdd(safeAdd(a, [(b & c) | (~b & d),(b & d) | (c & ~d),b ^ c ^ d,c ^ (b | ~d)][n]), safeAdd(x, t)),
                cnt = s;
            return safeAdd((num << cnt) | (num >>> (32 - cnt)), b);
        }

        return output;
    }

    /**
     * CRC32 (Cyclic Redundancy Check 32)
     * @param {string|number} input Input string or number
     * @returns Output checksum
     */
    static crc32(input) {
        var c,
            crcTable = [],
            crc = 0 ^ (-1);

        for(var n = 0;n < 256;n++) {
            c = n;
            for(var k = 0;k < 8;k++)
                c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            crcTable[n] = c;
        }

        for(var i = 0;i < input.length;i++)
            crc = (crc >>> 8) ^ crcTable[(crc ^ input.charCodeAt(i)) & 0xFF];
        
        return (crc ^ (-1)) >>> 0;
    }
}

export default AdataCrypt
