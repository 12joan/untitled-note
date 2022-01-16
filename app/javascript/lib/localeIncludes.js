// Extracted from https://github.com/idmadj/locale-includes

/* MIT License
 *
 * Copyright (c) 2020 idmadj
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const localeIncludes = (string, searchString, {position = 0, locales, ...options} = {}) => {
  if (string === undefined || 
    string === null || 
    searchString === undefined ||
    searchString === null
  ) {
    throw new Error('localeIncludes requires at least 2 parameters')
  }

  const stringLength = string.length
  const searchStringLength = searchString.length
  const lengthDiff = stringLength - searchStringLength

  for (let i = position; i <= lengthDiff; i++) {
    if (string.substring(i, i + searchStringLength).localeCompare(searchString, locales, options) === 0) {
      return true
    }
  }

  return false
}

export default localeIncludes
