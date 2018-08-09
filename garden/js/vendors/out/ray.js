var BABYLON;
(function (BABYLON) {
    var Ray = /** @class */ (function () {
        function Ray(origin, direction, length) {
            if (length === void 0) { length = Number.MAX_VALUE; }
            this.origin = origin;
            this.direction = direction;
            this.length = length;
        }
        // Methods
        Ray.prototype.intersectsBoxMinMax = function (minimum, maximum) {
            var d = 0.0;
            var maxValue = Number.MAX_VALUE;
            var inv;
            var min;
            var max;
            var temp;
            if (Math.abs(this.direction.x) < 0.0000001) {
                if (this.origin.x < minimum.x || this.origin.x > maximum.x) {
                    return false;
                }
            }
            else {
                inv = 1.0 / this.direction.x;
                min = (minimum.x - this.origin.x) * inv;
                max = (maximum.x - this.origin.x) * inv;
                if (max === -Infinity) {
                    max = Infinity;
                }
                if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }
                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);
                if (d > maxValue) {
                    return false;
                }
            }
            if (Math.abs(this.direction.y) < 0.0000001) {
                if (this.origin.y < minimum.y || this.origin.y > maximum.y) {
                    return false;
                }
            }
            else {
                inv = 1.0 / this.direction.y;
                min = (minimum.y - this.origin.y) * inv;
                max = (maximum.y - this.origin.y) * inv;
                if (max === -Infinity) {
                    max = Infinity;
                }
                if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }
                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);
                if (d > maxValue) {
                    return false;
                }
            }
            if (Math.abs(this.direction.z) < 0.0000001) {
                if (this.origin.z < minimum.z || this.origin.z > maximum.z) {
                    return false;
                }
            }
            else {
                inv = 1.0 / this.direction.z;
                min = (minimum.z - this.origin.z) * inv;
                max = (maximum.z - this.origin.z) * inv;
                if (max === -Infinity) {
                    max = Infinity;
                }
                if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }
                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);
                if (d > maxValue) {
                    return false;
                }
            }
            return true;
        };
        Ray.prototype.intersectsBox = function (box) {
            return this.intersectsBoxMinMax(box.minimum, box.maximum);
        };
        Ray.prototype.intersectsSphere = function (sphere) {
            var x = sphere.center.x - this.origin.x;
            var y = sphere.center.y - this.origin.y;
            var z = sphere.center.z - this.origin.z;
            var pyth = (x * x) + (y * y) + (z * z);
            var rr = sphere.radius * sphere.radius;
            if (pyth <= rr) {
                return true;
            }
            var dot = (x * this.direction.x) + (y * this.direction.y) + (z * this.direction.z);
            if (dot < 0.0) {
                return false;
            }
            var temp = pyth - (dot * dot);
            return temp <= rr;
        };
        Ray.prototype.intersectsTriangle = function (vertex0, vertex1, vertex2) {
            if (!this._edge1) {
                this._edge1 = BABYLON.Vector3.Zero();
                this._edge2 = BABYLON.Vector3.Zero();
                this._pvec = BABYLON.Vector3.Zero();
                this._tvec = BABYLON.Vector3.Zero();
                this._qvec = BABYLON.Vector3.Zero();
            }
            vertex1.subtractToRef(vertex0, this._edge1);
            vertex2.subtractToRef(vertex0, this._edge2);
            BABYLON.Vector3.CrossToRef(this.direction, this._edge2, this._pvec);
            var det = BABYLON.Vector3.Dot(this._edge1, this._pvec);
            if (det === 0) {
                return null;
            }
            var invdet = 1 / det;
            this.origin.subtractToRef(vertex0, this._tvec);
            var bu = BABYLON.Vector3.Dot(this._tvec, this._pvec) * invdet;
            if (bu < 0 || bu > 1.0) {
                return null;
            }
            BABYLON.Vector3.CrossToRef(this._tvec, this._edge1, this._qvec);
            var bv = BABYLON.Vector3.Dot(this.direction, this._qvec) * invdet;
            if (bv < 0 || bu + bv > 1.0) {
                return null;
            }
            //check if the distance is longer than the predefined length.
            var distance = BABYLON.Vector3.Dot(this._edge2, this._qvec) * invdet;
            if (distance > this.length) {
                return null;
            }
            return new BABYLON.IntersectionInfo(bu, bv, distance);
        };
        Ray.prototype.intersectsPlane = function (plane) {
            var distance;
            var result1 = BABYLON.Vector3.Dot(plane.normal, this.direction);
            if (Math.abs(result1) < 9.99999997475243E-07) {
                return null;
            }
            else {
                var result2 = BABYLON.Vector3.Dot(plane.normal, this.origin);
                distance = (-plane.d - result2) / result1;
                if (distance < 0.0) {
                    if (distance < -9.99999997475243E-07) {
                        return null;
                    }
                    else {
                        return 0;
                    }
                }
                return distance;
            }
        };
        Ray.prototype.intersectsMesh = function (mesh, fastCheck) {
            var tm = BABYLON.Tmp.Matrix[0];
            mesh.getWorldMatrix().invertToRef(tm);
            if (this._tmpRay) {
                Ray.TransformToRef(this, tm, this._tmpRay);
            }
            else {
                this._tmpRay = Ray.Transform(this, tm);
            }
            return mesh.intersects(this._tmpRay, fastCheck);
        };
        Ray.prototype.intersectsMeshes = function (meshes, fastCheck, results) {
            if (results) {
                results.length = 0;
            }
            else {
                results = [];
            }
            for (var i = 0; i < meshes.length; i++) {
                var pickInfo = this.intersectsMesh(meshes[i], fastCheck);
                if (pickInfo.hit) {
                    results.push(pickInfo);
                }
            }
            results.sort(this._comparePickingInfo);
            return results;
        };
        Ray.prototype._comparePickingInfo = function (pickingInfoA, pickingInfoB) {
            if (pickingInfoA.distance < pickingInfoB.distance) {
                return -1;
            }
            else if (pickingInfoA.distance > pickingInfoB.distance) {
                return 1;
            }
            else {
                return 0;
            }
        };
        /**
         * Intersection test between the ray and a given segment whithin a given tolerance (threshold)
         * @param sega the first point of the segment to test the intersection against
         * @param segb the second point of the segment to test the intersection against
         * @param threshold the tolerance margin, if the ray doesn't intersect the segment but is close to the given threshold, the intersection is successful
         * @return the distance from the ray origin to the intersection point if there's intersection, or -1 if there's no intersection
         */
        Ray.prototype.intersectionSegment = function (sega, segb, threshold) {
            var rsegb = this.origin.add(this.direction.multiplyByFloats(Ray.rayl, Ray.rayl, Ray.rayl));
            var u = segb.subtract(sega);
            var v = rsegb.subtract(this.origin);
            var w = sega.subtract(this.origin);
            var a = BABYLON.Vector3.Dot(u, u); // always >= 0
            var b = BABYLON.Vector3.Dot(u, v);
            var c = BABYLON.Vector3.Dot(v, v); // always >= 0
            var d = BABYLON.Vector3.Dot(u, w);
            var e = BABYLON.Vector3.Dot(v, w);
            var D = a * c - b * b; // always >= 0
            var sc, sN, sD = D; // sc = sN / sD, default sD = D >= 0
            var tc, tN, tD = D; // tc = tN / tD, default tD = D >= 0
            // compute the line parameters of the two closest points
            if (D < Ray.smallnum) {
                sN = 0.0; // force using point P0 on segment S1
                sD = 1.0; // to prevent possible division by 0.0 later
                tN = e;
                tD = c;
            }
            else {
                sN = (b * e - c * d);
                tN = (a * e - b * d);
                if (sN < 0.0) {
                    sN = 0.0;
                    tN = e;
                    tD = c;
                }
                else if (sN > sD) {
                    sN = sD;
                    tN = e + b;
                    tD = c;
                }
            }
            if (tN < 0.0) {
                tN = 0.0;
                // recompute sc for this edge
                if (-d < 0.0) {
                    sN = 0.0;
                }
                else if (-d > a)
                    sN = sD;
                else {
                    sN = -d;
                    sD = a;
                }
            }
            else if (tN > tD) {
                tN = tD;
                // recompute sc for this edge
                if ((-d + b) < 0.0) {
                    sN = 0;
                }
                else if ((-d + b) > a) {
                    sN = sD;
                }
                else {
                    sN = (-d + b);
                    sD = a;
                }
            }
            // finally do the division to get sc and tc
            sc = (Math.abs(sN) < Ray.smallnum ? 0.0 : sN / sD);
            tc = (Math.abs(tN) < Ray.smallnum ? 0.0 : tN / tD);
            // get the difference of the two closest points
            var qtc = v.multiplyByFloats(tc, tc, tc);
            var dP = w.add(u.multiplyByFloats(sc, sc, sc)).subtract(qtc); // = S1(sc) - S2(tc)
            var isIntersected = (tc > 0) && (tc <= this.length) && (dP.lengthSquared() < (threshold * threshold)); // return intersection result
            if (isIntersected) {
                return qtc.length();
            }
            return -1;
        };
        Ray.prototype.update = function (x, y, viewportWidth, viewportHeight, world, view, projection) {
            BABYLON.Vector3.UnprojectFloatsToRef(x, y, 0, viewportWidth, viewportHeight, world, view, projection, this.origin);
            BABYLON.Vector3.UnprojectFloatsToRef(x, y, 1, viewportWidth, viewportHeight, world, view, projection, BABYLON.Tmp.Vector3[0]);
            BABYLON.Tmp.Vector3[0].subtractToRef(this.origin, this.direction);
            this.direction.normalize();
            return this;
        };
        // Statics
        Ray.Zero = function () {
            return new Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero());
        };
        Ray.CreateNew = function (x, y, viewportWidth, viewportHeight, world, view, projection) {
            var result = Ray.Zero();
            return result.update(x, y, viewportWidth, viewportHeight, world, view, projection);
        };
        /**
        * Function will create a new transformed ray starting from origin and ending at the end point. Ray's length will be set, and ray will be
        * transformed to the given world matrix.
        * @param origin The origin point
        * @param end The end point
        * @param world a matrix to transform the ray to. Default is the identity matrix.
        */
        Ray.CreateNewFromTo = function (origin, end, world) {
            if (world === void 0) { world = BABYLON.Matrix.Identity(); }
            var direction = end.subtract(origin);
            var length = Math.sqrt((direction.x * direction.x) + (direction.y * direction.y) + (direction.z * direction.z));
            direction.normalize();
            return Ray.Transform(new Ray(origin, direction, length), world);
        };
        Ray.Transform = function (ray, matrix) {
            var result = new Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
            Ray.TransformToRef(ray, matrix, result);
            return result;
        };
        Ray.TransformToRef = function (ray, matrix, result) {
            BABYLON.Vector3.TransformCoordinatesToRef(ray.origin, matrix, result.origin);
            BABYLON.Vector3.TransformNormalToRef(ray.direction, matrix, result.direction);
            result.length = ray.length;
            var dir = result.direction;
            var len = dir.length();
            if (!(len === 0 || len === 1)) {
                var num = 1.0 / len;
                dir.x *= num;
                dir.y *= num;
                dir.z *= num;
                result.length *= len;
            }
        };
        Ray.smallnum = 0.00000001;
        Ray.rayl = 10e8;
        return Ray;
    }());
    BABYLON.Ray = Ray;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.ray.js.map
