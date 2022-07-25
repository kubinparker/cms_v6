var __ = {};


/* -------------------------------------------------------- ARRAY -------------------------------------------------------- */
var __Array = {};

/*
    ----- Sort an array by values using a user-defined comparison function -----
    //   example 1: let $stuff = {d: '3', a: '1', b: '11', c: '4'}
    //   example 1: usort($stuff, function (a, b) { return (a - b) })
    //   example 1: let $result = $stuff
    //   returns 1: {0: '1', 1: '3', 2: '4', 3: '11'}
*/
__Array.usort = function(inputArr, sorter) {
    let valArr = [];
    let k = '';
    let i = 0;
    let sortByReference = false;
    let populateArr = {};

    if (typeof sorter === 'string') {
        sorter = this[sorter];
    } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
        sorter = this[sorter[0]][sorter[1]];
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    for (k in inputArr) {
        // Get key and value arrays
        if (inputArr.hasOwnProperty(k)) {
            valArr.push(inputArr[k]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }
    try {
        valArr.sort(sorter);
    } catch (e) {
        return false;
    }
    for (i = 0; i < valArr.length; i++) {
        // Repopulate the old array
        populateArr[i] = valArr[i];
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array by keys using a user-defined comparison function -----
    //   example 1: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: uksort($data, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
    //   example 1: let $result = $data
    //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
*/
__Array.uksort = function(inputArr, sorter) {
    let tmpArr = {};
    let keys = [];
    let i = 0;
    let k = '';
    let sortByReference = false;
    let populateArr = {};

    if (typeof sorter === 'string') {
        sorter = this.window[sorter];
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }

    // Sort key names
    try {
        if (sorter) {
            keys.sort(sorter);
        } else {
            keys.sort();
        }
    } catch (e) {
        return false;
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmpArr[k] = inputArr[k];
        if (sortByReference) {
            delete inputArr[k];
        }
    }
    for (i in tmpArr) {
        if (tmpArr.hasOwnProperty(i)) {
            populateArr[i] = tmpArr[i];
        }
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array with a user-defined comparison function and maintain index association -----
    //   example 1: let $sorter = function (a, b) { if (a > b) {return 1;}if (a < b) {return -1;} return 0;}
    //   example 1: let $fruits = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: uasort($fruits, $sorter)
    //   example 1: let $result = $fruits
    //   returns 1: {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}
*/
__Array.uasort = function(inputArr, sorter) {
    let valArr = [];
    let k = '';
    let i = 0;
    let sortByReference = false;
    let populateArr = {};

    if (typeof sorter === 'string') {
        sorter = this[sorter];
    } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
        sorter = this[sorter[0]][sorter[1]];
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    for (k in inputArr) {
        // Get key and value arrays
        if (inputArr.hasOwnProperty(k)) {
            valArr.push([k, inputArr[k]]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }
    valArr.sort(function (a, b) {
        return sorter(a[1], b[1]);
    });

    for (i = 0; i < valArr.length; i++) {
        // Repopulate the old array
        populateArr[valArr[i][0]] = valArr[i][1];
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array -----
    // This function sorts an array. Elements will be arranged from lowest to highest when this function has completed.
    //   example 1: let $arr = ['Kevin', 'van', 'Zonneveld']
    //   example 1: sort($arr)
    //   example 1: let $result = $arr
    //   returns 1: ['Kevin', 'Zonneveld', 'van']
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: let $fruits = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 2: sort($fruits)
    //   example 2: let $result = $fruits
    //   returns 2: {0: 'apple', 1: 'banana', 2: 'lemon', 3: 'orange'}
*/
__Array.sort = function (inputArr, sortFlags) {

    let sorter;
    let i;
    let k;
    let sortByReference = false;
    let populateArr = {};

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            // leave sorter undefined, so built-in comparison is used
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            let loc = $locutus.php.locales[__I18n.i18n_loc_get_default()];

            if (loc && loc.sorting) {
                // if sorting exists on locale object, use it
                // otherwise let sorter be undefined
                // to fallback to built-in behavior
                sorter = loc.sorting;
            }
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return (a - b);
            };
            break;
        case 'SORT_REGULAR':
        default:
            sorter = function (a, b) {
                let aFloat = parseFloat(a);
                let bFloat = parseFloat(b);
                let aNumeric = aFloat + '' === a;
                let bNumeric = bFloat + '' === b;

                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }

                return a > b ? 1 : a < b ? -1 : 0;
            };
            break;
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    let valArr = [];
    for (k in inputArr) {
        // Get key and value arrays
        if (inputArr.hasOwnProperty(k)) {
            valArr.push(inputArr[k]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }

    valArr.sort(sorter);

    for (i = 0; i < valArr.length; i++) {
        // Repopulate the old array
        populateArr[i] = valArr[i];
    }
    return sortByReference || populateArr;
}

/*
    ----- Count all elements in an array, or something in an object -----
    //   example 1: sizeof([[0,0],[0,-4]], 'COUNT_RECURSIVE')
    //   returns 1: 6
    //   example 2: sizeof({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE')
    //   returns 2: 6
*/
__Array.sizeof = function (mixedlet, mode) {
    return this.count(mixedlet, mode);
}

/*
    ----- Shuffle an array -----
    //   example 1: let $data = {5:'a', 2:'3', 3:'c', 4:5, 'q':5}
    //   example 1: ini_set('locutus.sortByReference', true)
    //   example 1: shuffle($data)
    //   example 1: let $result = $data.q
    //   returns 1: 5
*/
__Array.shuffle = function (inputArr) {
    let valArr = [];
    let k = '';
    let i = 0;
    let sortByReference = false;
    let populateArr = [];

    for (k in inputArr) {
        // Get key and value arrays
        if (inputArr.hasOwnProperty(k)) {
            valArr.push(inputArr[k]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }
    valArr.sort(function () {
        return 0.5 - Math.random();
    });

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    for (i = 0; i < valArr.length; i++) {
        // Repopulate the old array
        populateArr[i] = valArr[i];
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array in reverse order DESC by value -----
    //   example 1: let $arr = ['Kevin', 'van', 'Zonneveld']
    //   example 1: rsort($arr)
    //   example 1: let $result = $arr
    //   returns 1: ['van', 'Zonneveld', 'Kevin']
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: let $fruits = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 2: rsort($fruits)
    //   example 2: let $result = $fruits
    //   returns 2: {0: 'orange', 1: 'lemon', 2: 'banana', 3: 'apple'}
*/
__Array.rsort = function (inputArr, sortFlags) {
    let sorter;
    let i;
    let k;
    let sortByReference = false;
    let populateArr = {};

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return __String.strnatcmp(b, a);
            }
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            let loc = __I18n.i18n_loc_get_default();
            sorter = $locutus.locales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return (b - a);
            }
            break;
        case 'SORT_REGULAR':
        default:
            // compare items normally (don't change types)
            sorter = function (b, a) {
                let aFloat = parseFloat(a);
                let bFloat = parseFloat(b);
                let aNumeric = aFloat + '' === a;
                let bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            }
            break;
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;
    let valArr = [];

    for (k in inputArr) {
        // Get key and value arrays
        if (inputArr.hasOwnProperty(k)) {
            valArr.push(inputArr[k]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }

    valArr.sort(sorter);

    for (i = 0; i < valArr.length; i++) {
        // Repopulate the old array
        populateArr[i] = valArr[i];
    }

    return sortByReference || populateArr;
}

/*
    ----- Set the internal pointer of an array to its first element -----
    //   example 1: reset({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
    //   returns 1: 'Kevin'
*/
__Array.reset = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };

    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    let arrpos = pointers.indexOf(arr);
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        for (let k in arr) {
            if (pointers.indexOf(arr) === -1) {
                pointers.push(arr, 0);
            } else {
                pointers[arrpos + 1] = 0;
            }
            return arr[k];
        }
        // Empty
        return false;
    }
    if (arr.length === 0) {
        return false;
    }
    pointers[arrpos + 1] = 0;
    return arr[pointers[arrpos + 1]];
}

/*
    ----- Create an array containing a range of elements -----
    //   example 1: range ( 0, 12 )
    //   returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    //   example 2: range( 0, 100, 10 )
    //   returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    //   example 3: range( 'a', 'i' )
    //   returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    //   example 4: range( 'c', 'a' )
    //   returns 4: ['c', 'b', 'a']
*/
__Array.range = function (low, high, step) {
    let matrix = [];
    let iVal;
    let endval;
    let plus;
    let walker = step || 1;
    let chars = false;

    if (!isNaN(low) && !isNaN(high)) {
        iVal = low;
        endval = high;
    } else if (isNaN(low) && isNaN(high)) {
        chars = true;
        iVal = low.charCodeAt(0);
        endval = high.charCodeAt(0);
    } else {
        iVal = (isNaN(low) ? 0 : low);
        endval = (isNaN(high) ? 0 : high);
    }

    plus = !(iVal > endval);
    if (plus) {
        while (iVal <= endval) {
            matrix.push(((chars) ? String.fromCharCode(iVal) : iVal));
            iVal += walker;
        }
    } else {
        while (iVal >= endval) {
            matrix.push(((chars) ? String.fromCharCode(iVal) : iVal));
            iVal -= walker;
        }
    }

    return matrix;
}

/*
    ----- Rewind the internal array pointer -----
    //   example 1: let $transport = ['foot', 'bike', 'car', 'plane']
    //   example 1: prev($transport)
    //   returns 1: false
*/
__Array.prev = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };

    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    let arrpos = pointers.indexOf(arr);
    let cursor = pointers[arrpos + 1];
    if (pointers.indexOf(arr) === -1 || cursor === 0) {
        return false;
    }
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        let ct = 0;
        for (let k in arr) {
            if (ct === cursor - 1) {
                pointers[arrpos + 1] -= 1;
                return arr[k];
            }
            ct++;
        }
        // Shouldn't reach here
    }
    if (arr.length === 0) {
        return false;
    }
    pointers[arrpos + 1] -= 1;
    return arr[pointers[arrpos + 1]];
}

/*
    ----- Return the current element in an array -----
    //   example 1: let $transport = ['foot', 'bike', 'car', 'plane']
    //   example 1: pos($transport)
    //   returns 1: 'foot'
*/
__Array.pos = function (arr) {
    return this.current(arr);
}

/*
    ----- Advance the internal pointer of an array -----
    //   example 1: let $transport = ['foot', 'bike', 'car', 'plane']
    //   example 1: next($transport)
    //   example 1: next($transport)
    //   returns 1: 'car'
*/
__Array.next = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }

    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    let arrpos = pointers.indexOf(arr);
    let cursor = pointers[arrpos + 1];
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        let ct = 0;
        for (let k in arr) {
            if (ct === cursor + 1) {
                pointers[arrpos + 1] += 1;
                return arr[k];
            }
            ct++;
        }
        // End
        return false;
    }
    if (arr.length === 0 || cursor === (arr.length - 1)) {
        return false;
    }
    pointers[arrpos + 1] += 1;
    return arr[pointers[arrpos + 1]];
}

/*
    ----- Sort an array using a "natural order" algorithm ASC by value -----
    //   example 1: let $array1 = {a:"img12.png", b:"img10.png", c:"img2.png", d:"img1.png"}
    //   example 1: natsort($array1)
    //   example 1: let $result = $array1
    //   returns 1: {d: 'img1.png', c: 'img2.png', b: 'img10.png', a: 'img12.png'}
*/
__Array.natsort = function (inputArr) {

    let valArr = [];
    let k;
    let i;
    let sortByReference = false;
    let populateArr = {};

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    // Get key and value arrays
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            valArr.push([k, inputArr[k]]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }
    valArr.sort(function (a, b) {
        return __String.strnatcmp(a[1], b[1]);
    })

    // Repopulate the old array
    for (i = 0; i < valArr.length; i++) {
        populateArr[valArr[i][0]] = valArr[i][1];
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array using a case insensitive "natural order" algorithm ASC by value -----
    //   example 1: let $array1 = {a:'IMG0.png', b:'img12.png', c:'img10.png', d:'img2.png', e:'img1.png', f:'IMG3.png'}
    //   example 1: natcasesort($array1)
    //   example 1: let $result = $array1
    //   returns 1: {a: 'IMG0.png', e: 'img1.png', d: 'img2.png', f: 'IMG3.png', c: 'img10.png', b: 'img12.png'}
*/
__Array.natcasesort = function (inputArr) {
    let valArr = [];
    let k;
    let i;
    let sortByReference = false;
    let populateArr = {};

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    // Get key and value arrays
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            valArr.push([k, inputArr[k]]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }
    valArr.sort(function (a, b) {
        return __String.strnatcasecmp(a[1], b[1]);
    })

    // Repopulate the old array
    for (i = 0; i < valArr.length; i++) {
        populateArr[valArr[i][0]] = valArr[i][1];
    }

    return sortByReference || populateArr;
}

/*
    -----  Sort an array by key ASC -----
    //   example 1: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: ksort($data)
    //   example 1: let $result = $data
    //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: let $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
    //   example 2: ksort($data)
    //   example 2: let $result = $data
    //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}
*/
__Array.ksort = function (inputArr, sortFlags) {

    let tmpArr = {};
    let keys = [];
    let sorter;
    let i;
    let k;
    let sortByReference = false;
    let populateArr = {};

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return __String.strnatcmp(b, a);
            }
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            let loc = __I18n.i18n_loc_get_default();
            sorter = $locutus.locales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return ((a + 0) - (b + 0));
            }
            break;
        default:
            // case 'SORT_REGULAR': // compare items normally (don't change types)
            sorter = function (a, b) {
                let aFloat = parseFloat(a);
                let bFloat = parseFloat(b);
                let aNumeric = aFloat + '' === a;
                let bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            }
            break;
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort(sorter);

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmpArr[k] = inputArr[k];
        if (sortByReference) {
            delete inputArr[k];
        }
    }
    for (i in tmpArr) {
        if (tmpArr.hasOwnProperty(i)) {
            populateArr[i] = tmpArr[i];
        }
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array by key in reverse order DESC -----
    //   example 1: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: krsort($data)
    //   example 1: let $result = $data
    //   returns 1: {d: 'lemon', c: 'apple', b: 'banana', a: 'orange'}
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: let $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
    //   example 2: krsort($data)
    //   example 2: let $result = $data
    //   returns 2: {3: 'Zonneveld', 2: 'van', 1: 'Kevin'}
*/
__Array.krsort = function (inputArr, sortFlags) {

    let tmpArr = {};
    let keys = [];
    let sorter;
    let i;
    let k;
    let sortByReference = false;
    let populateArr = {};

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return __String.strnatcmp(b, a);
            }
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            let loc = __I18n.i18n_loc_get_default();
            sorter = $locutus.locales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return (b - a);
            };
            break;
        case 'SORT_REGULAR':
        default:
            // compare items normally (don't change types)
            sorter = function (b, a) {
                let aFloat = parseFloat(a);
                let bFloat = parseFloat(b);
                let aNumeric = aFloat + '' === a;
                let bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            }
            break;
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort(sorter);

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmpArr[k] = inputArr[k];
        if (sortByReference) {
            delete inputArr[k];
        }
    }
    for (i in tmpArr) {
        if (tmpArr.hasOwnProperty(i)) {
            populateArr[i] = tmpArr[i];
        }
    }

    return sortByReference || populateArr;
}

/*
    ----- Fetch a key from an array -----
    //   example 1: let $array = {fruit1: 'apple', 'fruit2': 'orange'}
    //   example 1: key($array)
    //   returns 1: 'fruit1'
*/
__Array.key = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };

    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }

    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    let cursor = pointers[pointers.indexOf(arr) + 1];
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        let ct = 0;
        for (let k in arr) {
            if (ct === cursor) {
                return k;
            }
            ct++;
        }
        // Empty
        return false;
    }
    if (arr.length === 0) {
        return false;
    }

    return cursor;
}

/*
    ----- Checks if a value exists in an array -----
    //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: true
    //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
    //   returns 2: false
    //   example 3: in_array(1, ['1', '2', '3'])
    //   example 3: in_array(1, ['1', '2', '3'], false)
    //   returns 3: true
    //   returns 3: true
    //   example 4: in_array(1, ['1', '2', '3'], true)
    //   returns 4: false
*/
__Array.in_array = function (needle, haystack, argStrict) {
    let key = '';
    let strict = !!argStrict;

    // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
    // in just one for, in order to improve the performance
    // deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) { // eslint-disable-line eqeqeq
                return true;
            }
        }
    }

    return false;
}

/*
    ----- Set the internal pointer of an array to its last element -----
    //   example 1: end({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
    //   returns 1: 'Zonneveld'
    //   example 2: end(['Kevin', 'van', 'Zonneveld'])
    //   returns 2: 'Zonneveld'
*/
__Array.end = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }

    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    let arrpos = pointers.indexOf(arr);
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        let ct = 0;
        let val;
        for (let k in arr) {
            ct++;
            val = arr[k];
        }
        if (ct === 0) {
            // Empty
            return false;
        }
        pointers[arrpos + 1] = ct - 1;
        return val;
    }
    if (arr.length === 0) {
        return false;
    }
    pointers[arrpos + 1] = arr.length - 1;
    return arr[pointers[arrpos + 1]];
}

/*
    ----- Return the current key and value pair from an array and advance the array cursor -----
    //   example 1: each({a: "apple", b: "balloon"})
    //   returns 1: {0: "a", 1: "apple", key: "a", value: "apple"}
*/
__Array.each = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }

    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    let arrpos = pointers.indexOf(arr);
    let cursor = pointers[arrpos + 1];
    let pos = 0;

    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        let ct = 0;
        for (let k in arr) {
            if (ct === cursor) {
                pointers[arrpos + 1] += 1;
                if (each.returnArrayOnly) {
                    return [k, arr[k]];
                } else {
                    return {
                        1: arr[k],
                        value: arr[k],
                        0: k,
                        key: k
                    };
                }
            }
            ct++;
        }
        // Empty
        return false;
    }
    if (arr.length === 0 || cursor === arr.length) {
        return false;
    }
    pos = cursor;
    pointers[arrpos + 1] += 1;
    if (each.returnArrayOnly) {
        return [pos, arr[pos]];
    } else {
        return {
            1: arr[pos],
            value: arr[pos],
            0: pos,
            key: pos
        };
    }
}

/*
    ----- Return the current element in an array -----
    // Every array has an internal pointer to its "current" element, which is initialized to the first element inserted into the array.
    //   example 1: let $transport = ['foot', 'bike', 'car', 'plane']
    //   example 1: current($transport)
    //   returns 1: 'foot'
*/
__Array.current = function (arr) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.pointers = $locutus.php.pointers || [];
    let pointers = $locutus.php.pointers;

    let indexOf = function (value) {
        for (let i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    let arrpos = pointers.indexOf(arr);
    let cursor = pointers[arrpos + 1];
    if (Object.prototype.toString.call(arr) === '[object Array]') {
        return arr[cursor] || false;
    }
    let ct = 0;
    for (let k in arr) {
        if (ct === cursor) {
            return arr[k];
        }
        ct++;
    }
    // Empty
    return false;
}

/*
    -----  Count all elements in an array, or something in an object -----
    //   example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE')
    //   returns 1: 6
    //   example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE')
    //   returns 2: 6
    //   example 3: count(['fruits' => array('orange', 'banana', 'apple'), 'veggie' => array('carrot', 'collard', 'pea')], 'COUNT_RECURSIVE')
    //   returns 3: 8
    //   example 4: count(['fruits' => array('orange', 'banana', 'apple'), 'veggie' => array('carrot', 'collard', 'pea')])
    //   returns 4: 2
*/
__Array.count = function (mixedlet, mode) {
    let key;
    let cnt = 0;

    if (mixedlet === null || typeof mixedlet === 'undefined') {
        return 0;
    } else if (mixedlet.constructor !== Array && mixedlet.constructor !== Object) {
        return 1;
    }

    if (mode === 'COUNT_RECURSIVE') {
        mode = 1;
    }
    if (mode !== 1) {
        mode = 0;
    }

    for (key in mixedlet) {
        if (mixedlet.hasOwnProperty(key)) {
            cnt++;
            if (mode === 1 && mixedlet[key] &&
                (mixedlet[key].constructor === Array ||
                    mixedlet[key].constructor === Object)) {
                cnt += count(mixedlet[key], 1);
            }
        }
    }

    return cnt;
}

/*
    ----- Sort an array and maintain index association ASC by value -----
    //   example 1: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: asort($data)
    //   example 1: let $result = $data
    //   returns 1: {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 2: asort($data)
    //   example 2: let $result = $data
    //   returns 2: {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}
*/
__Array.asort = function (inputArr, sortFlags) {
    let valArr = [];
    let valArrLen = 0;
    let k;
    let i;
    let sorter;
    let sortByReference = false;
    let populateArr = {};

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return __String.strnatcmp(a, b);
            }
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            let loc = __I18n.i18n_loc_get_default();
            sorter = $locutus.php.locales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return (a - b);
            }
            break;
        case 'SORT_REGULAR':
            // compare items normally (don't change types)
            break;
        default:
            sorter = function (a, b) {
                let aFloat = parseFloat(a);
                let bFloat = parseFloat(b);
                let aNumeric = aFloat + '' === a;
                let bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            }
            break;
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';
    sortByReference = iniVal === 'on';
    populateArr = sortByReference ? inputArr : populateArr;

    // Get key and value arrays
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            valArr.push([k, inputArr[k]]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }

    valArr.sort(function (a, b) {
        return sorter(a[1], b[1]);
    })

    // Repopulate the old array
    for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
        populateArr[valArr[i][0]] = valArr[i][1];
    }

    return sortByReference || populateArr;
}

/*
    ----- Sort an array in reverse order and maintain index association DESC by value -----
    //   example 1: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: arsort($data)
    //   example 1: let $result = $data
    //   returns 1: {a: 'orange', d: 'lemon', b: 'banana', c: 'apple'}
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: let $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 2: arsort($data)
    //   example 2: let $result = $data
    //   returns 2: {a: 'orange', d: 'lemon', b: 'banana', c: 'apple'}
*/
__Array.arsort = function (inputArr, sortFlags) {
    let valArr = [];
    let valArrLen = 0;
    let k;
    let i;
    let sorter;
    let sortByReference = false;
    let populateArr = {};

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return __String.strnatcmp(b, a);
            }
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            let loc = __I18n.i18n_loc_get_default();
            sorter = $locutus.php.locales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return (a - b);
            }
            break;
        case 'SORT_REGULAR':
            // compare items normally (don't change types)
            break;
        default:
            sorter = function (b, a) {
                let aFloat = parseFloat(a);
                let bFloat = parseFloat(b);
                let aNumeric = aFloat + '' === a;
                let bNumeric = bFloat + '' === b;

                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }

                return a > b ? 1 : a < b ? -1 : 0;
            }
            break;
    }

    let iniVal = (typeof require !== 'undefined' ? __Info.ini_get('locutus.sortByReference') : undefined) ||
        'on';

    sortByReference = iniVal === 'on';

    // Get key and value arrays
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            valArr.push([k, inputArr[k]]);
            if (sortByReference) {
                delete inputArr[k];
            }
        }
    }
    valArr.sort(function (a, b) {
        return sorter(a[1], b[1]);
    })

    // Repopulate the old array
    for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
        populateArr[valArr[i][0]] = valArr[i][1];
        if (sortByReference) {
            inputArr[valArr[i][0]] = valArr[i][1];
        }
    }

    return sortByReference || populateArr;
}

/*
    ----- Apply a user function recursively to every member of an array -----
    //   example 1: array_walk_recursive([3, 4], function () {}, 'userdata')
    //   returns 1: true
    //   example 2: array_walk_recursive([3, [4]], function () {}, 'userdata')
    //   returns 2: true
    //   example 3: array_walk_recursive([3, []], function () {}, 'userdata')
    //   returns 3: true
*/
__Array.array_walk_recursive = function (array, funcname, userdata) {
    if (!array || typeof array !== 'object') {
        return false;
    }

    if (typeof funcname !== 'function') {
        return false;
    }

    for (let key in array) {
        // apply "funcname" recursively only on arrays
        if (Object.prototype.toString.call(array[key]) === '[object Array]') {
            let funcArgs = [array[key], funcname];
            if (arguments.length > 2) {
                funcArgs.push(userdata);
            }
            if (array_walk_recursive.apply(null, funcArgs) === false) {
                return false;
            }
            continue;
        }
        try {
            if (arguments.length > 2) {
                funcname(array[key], key, userdata);
            } else {
                funcname(array[key], key);
            }
        } catch (e) {
            return false;
        }
    }

    return true;
}

/*
    ----- Apply a user supplied function to every member of an array -----
    //   example 1: array_walk ([3, 4], function () {}, 'userdata')
    //   returns 1: true
    //   example 2: array_walk ('mystring', function () {})
    //   returns 2: false
    //   example 3: array_walk ({"title":"my title"}, function () {})
    //   returns 3: true
*/
__Array.array_walk = function (array, funcname, userdata) {
    if (!array || typeof array !== 'object') {
        return false
    }

    try {
        if (typeof funcname === 'function') {
            for (let key in array) {
                if (arguments.length > 2) {
                    funcname(array[key], key, userdata)
                } else {
                    funcname(array[key], key)
                }
            }
        } else {
            return false
        }
    } catch (e) {
        return false
    }

    return true
}

/*
    ----- Return all the values of an array -----
    //   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
    //   returns 1: [ 'Kevin', 'van Zonneveld' ]
*/
__Array.array_values = function (input) {

    let tmpArr = [];
    let key = '';

    for (key in input) {
        tmpArr[tmpArr.length] = input[key];
    }

    return tmpArr;
}

/*
    ----- Prepend one or more elements to the beginning of an array -----
    //   example 1: array_unshift(['van', 'Zonneveld'], 'Kevin')
    //   returns 1: 3
*/
__Array.array_unshift = function (array) {
    let i = arguments.length;

    while (--i !== 0) {
        arguments[0].unshift(arguments[i]);
    }

    return arguments[0].length;
}

/*
    ----- Removes duplicate values from an array -----
    //   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin'])
    //   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
    //   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'})
    //   returns 2: {a: 'green', 0: 'red', 1: 'blue'}
*/
__Array.array_unique = function (inputArr) {
    let key = '';
    let tmpArr2 = {};
    let val = '';

    let _arraySearch = function (needle, haystack) {
        let fkey = '';
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey;
                }
            }
        }
        return false;
    }

    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key];
            if (_arraySearch(val, tmpArr2) === false) {
                tmpArr2[key] = val;
            }
        }
    }

    return tmpArr2;
}

/*
    ----- Computes the intersection of arrays with additional index check, compares data and indexes by separate callback functions -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
    //   example 1: array_uintersect_uassoc($array1, $array2, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;}, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
    //   returns 1: {a: 'green', b: 'brown'}
*/
__Array.array_uintersect_uassoc = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let arglm2 = arglm1 - 1;
    let cb = arguments[arglm1];
    let cb0 = arguments[arglm2];
    let k1 = '';
    let i = 1;
    let k = '';
    let arr = {};

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    cb0 = (typeof cb0 === 'string')
        ? $global[cb0]
        : (Object.prototype.toString.call(cb0) === '[object Array]')
            ? $global[cb0[0]][cb0[1]]
            : cb0;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        arrs: for (i = 1; i < arglm2; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
                    if (i === arguments.length - 3) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}

/*
    ----- Computes the intersection of arrays, compares data by a callback function -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
    //   example 1: array_uintersect($array1, $array2, function( f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
    //   returns 1: {a: 'green', b: 'brown', 0: 'red'}
*/
__Array.array_uintersect = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let arglm2 = arglm1 - 1;
    let cb = arguments[arglm1];
    let k1 = '';
    let i = 1;
    let arr = {};
    let k = '';

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (cb(arr[k], arr1[k1]) === 0) {
                    if (i === arglm2) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}

/*
    ----- Computes the difference of arrays with additional index check, compares data and indexes by a callback function -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
    //   example 1: array_udiff_uassoc($array1, $array2, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;}, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
    //   returns 1: {0: 'red', c: 'blue'}
*/
__Array.array_udiff_uassoc = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let arglm2 = arglm1 - 1;
    let cb = arguments[arglm1];
    let cb0 = arguments[arglm2];
    let k1 = '';
    let i = 1;
    let k = '';
    let arr = {};

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    cb0 = (typeof cb0 === 'string')
        ? $global[cb0]
        : (Object.prototype.toString.call(cb0) === '[object Array]')
            ? $global[cb0[0]][cb0[1]]
            : cb0;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < arglm2; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/*
    ----- Computes the difference of arrays with additional index check, compares data by a callback function -----
    //   example 1: array_udiff_assoc({0: 'kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'}, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
    //   returns 1: {1: 'van', 2: 'Zonneveld'}
*/
__Array.array_udiff_assoc = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let cb = arguments[arglm1];
    let arr = {};
    let i = 1;
    let k1 = '';
    let k = '';

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < arglm1; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (cb(arr[k], arr1[k1]) === 0 && k === k1) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/*
    ----- Computes the difference of arrays by using a callback function for data comparison -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
    //   example 1: array_udiff($array1, $array2, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
    //   returns 1: {c: 'blue'}
*/
__Array.array_udiff = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let cb = arguments[arglm1];
    let arr = '';
    let i = 1;
    let k1 = '';
    let k = '';

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (cb(arr[k], arr1[k1]) === 0) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/*
    ----- Calculate the sum of values in an array -----
    //   example 1: array_sum([4, 9, 182.6])
    //   returns 1: 195.6
    //   example 2: let $total = []
    //   example 2: let $index = 0.1
    //   example 2: for (let $y = 0; $y < 12; $y++){ $total[$y] = $y + $index }
    //   example 2: array_sum($total)
    //   returns 2: 67.2
*/
__Array.array_sum = function (array) {
    let key;
    let sum = 0;

    // input sanitation
    if (typeof array !== 'object') {
        return null;
    }

    for (key in array) {
        if (!isNaN(parseFloat(array[key]))) {
            sum += parseFloat(array[key]);
        }
    }

    return sum;
}

/*
    ----- Remove a portion of the array and replace it with something else -----
    //   example 1: let $input = {4: "red", 'abc': "green", 2: "blue", 'dud': "yellow"}
    //   example 1: array_splice($input, 2)
    //   returns 1: {4: "red", 'abc': "green"}
    //   example 2: let $input = ["red", "green", "blue", "yellow"]
    //   example 2: array_splice($input, 3, 0, "purple")
    //   returns 2: []
    //   example 3: let $input = ["red", "green", "blue", "yellow"]
    //   example 3: array_splice($input, -1, 1, ["black", "maroon"])
    //   returns 3: ("red", "green", "blue", "black", "maroon")
*/
__Array.array_splice = function (arr, offst, lgth, replacement) {

    //var isInt = require('../var/is_int');
    var isInt = __Var.is_int;

    var _checkToUpIndices = function (arr, ct, key) {
        // Deal with situation, e.g., if encounter index 4 and try
        // to set it to 0, but 0 exists later in loop (need to
        // increment all subsequent (skipping current key,
        // since we need its value below) until find unused)
        if (arr[ct] !== undefined) {
            var tmp = ct;
            ct += 1;
            if (ct === key) {
                ct += 1;
            }
            ct = _checkToUpIndices(arr, ct, key);
            arr[ct] = arr[tmp];
            delete arr[tmp];
        }
        return ct;
    };

    if (replacement && typeof replacement !== 'object') {
        replacement = [replacement];
    }
    if (lgth === undefined) {
        lgth = offst >= 0 ? arr.length - offst : -offst;
    } else if (lgth < 0) {
        lgth = (offst >= 0 ? arr.length - offst : -offst) + lgth;
    }

    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        var lgt = 0;
        var ct = -1;
        var rmvd = [];
        var rmvdObj = {};
        var replCt = -1;
        var intCt = -1;
        var returnArr = true;
        var rmvdCt = 0;
        // var rmvdLngth = 0
        var key = '';
        // rmvdObj.length = 0;
        for (key in arr) {
            // Can do arr.__count__ in some browsers
            lgt += 1;
        }
        offst = (offst >= 0) ? offst : lgt + offst;
        for (key in arr) {
            ct += 1;
            if (ct < offst) {
                if (isInt(key)) {
                    intCt += 1;
                    if (parseInt(key, 10) === intCt) {
                        // Key is already numbered ok, so don't need to change key for value
                        continue;
                    }
                    // Deal with situation, e.g.,
                    _checkToUpIndices(arr, intCt, key);
                    // if encounter index 4 and try to set it to 0, but 0 exists later in loop
                    arr[intCt] = arr[key];
                    delete arr[key];
                }
                continue;
            }
            if (returnArr && isInt(key)) {
                rmvd.push(arr[key]);
                // PHP starts over here too
                rmvdObj[rmvdCt++] = arr[key];
            } else {
                rmvdObj[key] = arr[key];
                returnArr = false;
            }
            // rmvdLngth += 1
            // rmvdObj.length += 1;
            if (replacement && replacement[++replCt]) {
                arr[key] = replacement[replCt];
            } else {
                delete arr[key];
            }
        }
        // Make (back) into an array-like object
        // arr.length = lgt - rmvdLngth + (replacement ? replacement.length : 0);
        return returnArr ? rmvd : rmvdObj;
    }

    if (replacement) {
        replacement.unshift(offst, lgth);
        return Array.prototype.splice.apply(arr, replacement);
    }

    return arr.splice(offst, lgth);
}

/*
    ----- Extract a slice of the array -----
    //   example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1)
    //   returns 1: [ 'c', 'd' ]
    //   example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true)
    //   returns 2: {2: 'c', 3: 'd'}
*/
__Array.array_slice = function (arr, offst, lgth, preserveKeys) {
    let key = '';

    if (Object.prototype.toString.call(arr) !== '[object Array]' || (preserveKeys && offst !== 0)) {
        // Assoc. array as input or if required as output
        let lgt = 0;
        let newAssoc = {};
        for (key in arr) {
            lgt += 1;
            newAssoc[key] = arr[key];
        }
        arr = newAssoc;

        offst = (offst < 0) ? lgt + offst : offst;
        lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;

        let assoc = {};
        let start = false;
        let it = -1;
        let arrlgth = 0;
        let noPkIdx = 0;

        for (key in arr) {
            ++it;
            if (arrlgth >= lgth) {
                break;
            }
            if (it === offst) {
                start = true;
            }
            if (!start) {
                continue;
            }
            ++arrlgth;
            if (__let.is_int(key) && !preserveKeys) {
                assoc[noPkIdx++] = arr[key];
            } else {
                assoc[key] = arr[key];
            }
        }
        // Make as array-like object (though length will not be dynamic)
        return assoc;
    }

    if (lgth === undefined) {
        return arr.slice(offst);
    } else if (lgth >= 0) {
        return arr.slice(offst, offst + lgth);
    } else {
        return arr.slice(offst, lgth);
    }
}

/*
    ----- Shift an element off the beginning of array -----
    //   example 1: array_shift(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'Kevin'
*/
__Array.array_shift = function (inputArr) {
    let _checkToUpIndices = function (arr, ct, key) {
        // Deal with situation, e.g., if encounter index 4 and try
        // to set it to 0, but 0 exists later in loop (need to
        // increment all subsequent (skipping current key, since
        // we need its value below) until find unused)
        if (arr[ct] !== undefined) {
            let tmp = ct;
            ct += 1;
            if (ct === key) {
                ct += 1;
            }
            ct = _checkToUpIndices(arr, ct, key);
            arr[ct] = arr[tmp];
            delete arr[tmp];
        }

        return ct;
    };

    if (inputArr.length === 0) {
        return null;
    }
    if (inputArr.length > 0) {
        return inputArr.shift();
    }
}

/*
    ----- Searches the array for a given value and returns the first corresponding key if successful -----
    //   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'})
    //   returns 1: 'surname'
    //   example 2: array_search('3', {a: 3, b: 5, c: 7})
    //   returns 2: 'a'
*/
__Array.array_search = function (needle, haystack, argStrict) {
    let strict = !!argStrict;
    let key = '';

    if (typeof needle === 'object' && needle.exec) {
        // Duck-type for RegExp
        if (!strict) {
            // Let's consider case sensitive searches as strict
            let flags = 'i' +
                (needle.global ? 'g' : '') +
                (needle.multiline ? 'm' : '') +
                // sticky is FF only
                (needle.sticky ? 'y' : '');
            needle = new RegExp(needle.source, flags);
        }
        for (key in haystack) {
            if (haystack.hasOwnProperty(key)) {
                if (needle.test(haystack[key])) {
                    return key;
                }
            }
        }
        return false;
    }

    for (key in haystack) {
        if (haystack.hasOwnProperty(key)) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) { // eslint-disable-line eqeqeq
                return key;
            }
        }
    }

    return false;
}

/*
    ----- Return an array with elements in reverse order -----
    //   example 1: array_reverse( [ 'php', '4.0', ['green', 'red'] ], true)
    //   returns 1: { 2: ['green', 'red'], 1: '4.0', 0: 'php'}
*/
__Array.array_reverse = function (array, preserveKeys) {
    let isArray = Object.prototype.toString.call(array) === '[object Array]';
    let tmpArr = preserveKeys ? {} : [];
    let key;

    if (isArray && !preserveKeys) {
        return array.slice(0).reverse();
    }

    if (preserveKeys) {
        let keys = [];
        for (key in array) {
            keys.push(key);
        }

        let i = keys.length;
        while (i--) {
            key = keys[i];
            // @todo: don't rely on browsers keeping keys in insertion order
            // it's implementation specific
            // eg. the result will differ from expected in Google Chrome
            tmpArr[key] = array[key];
        }
    } else {
        for (key in array) {
            tmpArr.unshift(array[key]);
        }
    }

    return tmpArr;
}

/*
    ----- Replaces elements from passed arrays into the first array recursively -----
    //   example 1: array_replace_recursive({'citrus' : ['orange'], 'berries' : ['blackberry', 'raspberry']}, {'citrus' : ['pineapple'], 'berries' : ['blueberry']})
    //   returns 1: {citrus : ['pineapple'], berries : ['blueberry', 'raspberry']}
*/
__Array.array_replace_recursive = function (arr) {
    let i = 0;
    let p = '';
    let argl = arguments.length;
    let retObj;

    if (argl < 2) {
        dd('There should be at least 2 arguments passed to array_replace_recursive()');
    }

    // Although docs state that the arguments are passed in by reference,
    // it seems they are not altered, but rather the copy that is returned
    // So we make a copy here, instead of acting on arr itself
    if (Object.prototype.toString.call(arr) === '[object Array]') {
        retObj = [];
        for (p in arr) {
            retObj.push(arr[p]);
        }
    } else {
        retObj = {};
        for (p in arr) {
            retObj[p] = arr[p];
        }
    }

    for (i = 1; i < argl; i++) {
        for (p in arguments[i]) {
            if (retObj[p] && typeof retObj[p] === 'object') {
                retObj[p] = array_replace_recursive(retObj[p], arguments[i][p]);
            } else {
                retObj[p] = arguments[i][p];
            }
        }
    }

    return retObj;
}

/*
    ----- Replaces elements from passed arrays into the first array -----
    //   example 1: array_replace(["orange", "banana", "apple", "raspberry"], {0 : "pineapple", 4 : "cherry"}, {0:"grape"})
    //   returns 1: {0: 'grape', 1: 'banana', 2: 'apple', 3: 'raspberry', 4: 'cherry'}
*/
__Array.array_replace = function (arr) {
    let retObj = {};
    let i = 0;
    let p = '';
    let argl = arguments.length;

    if (argl < 2) {
        dd('There should be at least 2 arguments passed to array_replace()');
    }

    // Although docs state that the arguments are passed in by reference,
    // it seems they are not altered, but rather the copy that is returned
    // (just guessing), so we make a copy here, instead of acting on arr itself
    for (p in arr) {
        retObj[p] = arr[p];
    }

    for (i = 1; i < argl; i++) {
        for (p in arguments[i]) {
            retObj[p] = arguments[i][p];
        }
    }

    return retObj;
}

/*
    ----- Title -----
    //   example 1: array_reduce([1, 2, 3, 4, 5], function (v, w){v += w;return v;})
    //   returns 1: 15
    //   example 2: array_reduce($a, function ($carry, $item) { $carry *= $item; return $carry; }, 10)
    //   returns 2: 1200 .because: 10*1*2*3*4*5
    //   example 3: array_reduce($x, "sum", "No data to reduce")
    //   returns 3: string(17) "No data to reduce"
*/
__Array.array_reduce = function (aInput, callback) {
    let long = aInput.length;
    let res = 0;
    let i = 0;
    let tmp = [];

    for (i = 0; i < long; i += 2) {
        tmp[0] = aInput[i];
        if (aInput[(i + 1)]) {
            tmp[1] = aInput[(i + 1)];
        } else {
            tmp[1] = 0;
        }
        res += callback.apply(null, tmp);
        tmp = [];
    }

    return res;
}

/*
    ----- Pick one or more random keys out of an array -----
    //   example 1: array_rand( ['Kevin'], 1 )
    //    returns 1: '0'
*/
__Array.array_rand = function (array, num) {
    let keys = Object.keys(array);

    if (typeof num === 'undefined' || num === null) {
        num = 1;
    } else {
        num = +num;
    }

    if (isNaN(num) || num < 1 || num > keys.length) {
        return null;
    }

    // shuffle the array of keys
    for (let i = keys.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // 0 ≤ j ≤ i

        let tmp = keys[j];
        keys[j] = keys[i];
        keys[i] = tmp;
    }

    return num === 1 ? keys[0] : keys.slice(0, num);
}

/*
    ----- Push one or more elements onto the end of array -----
    //   example 1: array_push(['kevin','van'], 'zonneveld')
    //   returns 1: 3
*/
__Array.array_push = function (inputArr) {
    let i = 0;
    let pr = '';
    let argv = arguments;
    let argc = argv.length;
    let allDigits = /^\d$/;
    let size = 0;
    let highestIdx = 0;
    let len = 0;

    if (inputArr.hasOwnProperty('length')) {
        for (i = 1; i < argc; i++) {
            inputArr[inputArr.length] = argv[i];
        }
        return inputArr.length;
    }

    // Associative (object)
    for (pr in inputArr) {
        if (inputArr.hasOwnProperty(pr)) {
            ++len;
            if (pr.search(allDigits) !== -1) {
                size = parseInt(pr, 10);
                highestIdx = size > highestIdx ? size : highestIdx;
            }
        }
    }
    for (i = 1; i < argc; i++) {
        inputArr[++highestIdx] = argv[i];
    }

    return len + i - 1;
}

/*
    ----- Calculate the product of values in an array -----
    //   example 1: array_product([ 2, 4, 6, 8 ])
    //   returns 1: 384
*/
__Array.array_product = function (input) {
    let idx = 0;
    let product = 1;
    let il = 0;

    if (Object.prototype.toString.call(input) !== '[object Array]') {
        return null;
    }

    il = input.length;
    while (idx < il) {
        product *= (!isNaN(input[idx]) ? input[idx] : 0);
        idx++;
    }

    return product;
}

/*
    ----- Remove last item in Array/Object -----
    //   example 1: array_pop([0,1,2])
    //   returns 1: 2
    //   example 2: let $data = {firstName: 'Kevin', surName: 'van Zonneveld'}
    //   example 2: let $lastElem = array_pop($data)
    //   example 2: let $result = $data
    //   returns 2: {firstName: 'Kevin'}
*/
__Array.array_pop = function (inputArr) {
    let key = '';
    let lastKey = '';

    if (inputArr.hasOwnProperty('length')) {
        // Indexed
        if (!inputArr.length) {
            // Done popping, are we?
            return null;
        }
        return inputArr.pop()
    } else {
        // Associative
        for (key in inputArr) {
            if (inputArr.hasOwnProperty(key)) {
                lastKey = key;
            }
        }
        if (lastKey) {
            let tmp = inputArr[lastKey];
            delete (inputArr[lastKey]);
            return tmp;
        } else {
            return null;
        }
    }
}

/*
    ----- Pad array to the specified length with a value -----
    //   example 1: array_pad([ 7, 8, 9 ], 2, 'a')
    //   returns 1: [ 7, 8, 9]
    //   example 2: array_pad([ 7, 8, 9 ], 5, 'a')
    //   returns 2: [ 7, 8, 9, 'a', 'a']
    //   example 3: array_pad([ 7, 8, 9 ], 5, 2)
    //   returns 3: [ 7, 8, 9, 2, 2]
    //   example 4: array_pad([ 7, 8, 9 ], -5, 'a')
    //   returns 4: [ 'a', 'a', 7, 8, 9 ]
*/
__Array.array_pad = function (input, padSize, padValue) {
    let pad = [];
    let newArray = [];
    let newLength;
    let diff = 0;
    let i = 0;

    if (Object.prototype.toString.call(input) === '[object Array]' && !isNaN(padSize)) {
        newLength = ((padSize < 0) ? (padSize * -1) : padSize);
        diff = newLength - input.length;

        if (diff > 0) {
            for (i = 0; i < diff; i++) {
                newArray[i] = padValue;
            }
            pad = ((padSize < 0) ? newArray.concat(input) : input.concat(newArray));
        } else {
            pad = input;
        }
    }

    return pad;
}

/*
    ----- Sort multiple or multi-dimensional arrays -----
    //   example 1: array_multisort([1, 2, 1, 2, 1, 2], [1, 2, 3, 4, 5, 6])
    //   returns 1: true
    //   example 2: let $characters = {A: 'Edward', B: 'Locke', C: 'Sabin', D: 'Terra', E: 'Edward'}
    //   example 2: let $jobs = {A: 'Warrior', B: 'Thief', C: 'Monk', D: 'Mage', E: 'Knight'}
    //   example 2: array_multisort($characters, 'SORT_DESC', 'SORT_STRING', $jobs, 'SORT_ASC', 'SORT_STRING')
    //   returns 2: true
    //   example 3: let $lastnames = [ 'Carter','Adams','Monroe','Tyler','Madison','Kennedy','Adams']
    //   example 3: let $firstnames = ['James', 'John' ,'James', 'John', 'James',  'John',   'John']
    //   example 3: let $president = [ 39, 6, 5, 10, 4, 35, 2 ]
    //   example 3: array_multisort($firstnames, 'SORT_DESC', 'SORT_STRING', $lastnames, 'SORT_ASC', 'SORT_STRING', $president, 'SORT_NUMERIC')
    //   returns 3: true
*/
__Array.array_multisort = function (arr) {
    let g;
    let i;
    let j;
    let k;
    let l;
    let sal;
    let vkey;
    let elIndex;
    let lastSorts;
    let tmpArray;
    let zlast;

    let sortFlag = [0];
    let thingsToSort = [];
    let nLastSort = [];
    let lastSort = [];
    // possibly redundant
    let args = arguments;

    let flags = {
        'SORT_REGULAR': 16,
        'SORT_NUMERIC': 17,
        'SORT_STRING': 18,
        'SORT_ASC': 32,
        'SORT_DESC': 40
    };

    let sortDuplicator = function (a, b) {
        return nLastSort.shift();
    };

    let sortFunctions = [
        [
            function (a, b) {
                lastSort.push(a > b ? 1 : (a < b ? -1 : 0));
                return a > b ? 1 : (a < b ? -1 : 0);
            },
            function (a, b) {
                lastSort.push(b > a ? 1 : (b < a ? -1 : 0));
                return b > a ? 1 : (b < a ? -1 : 0);
            }
        ],
        [
            function (a, b) {
                lastSort.push(a - b);
                return a - b;
            },
            function (a, b) {
                lastSort.push(b - a);
                return b - a;
            }
        ],
        [
            function (a, b) {
                lastSort.push((a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0));
                return (a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0);
            },
            function (a, b) {
                lastSort.push((b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0));
                return (b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0);
            }
        ]
    ];

    let sortArrs = [
        []
    ];

    let sortKeys = [
        []
    ];

    // Store first argument into sortArrs and sortKeys if an Object.
    // First Argument should be either a Javascript Array or an Object,
    // otherwise function would return FALSE like in PHP
    if (Object.prototype.toString.call(arr) === '[object Array]') {
        sortArrs[0] = arr;
    } else if (arr && typeof arr === 'object') {
        for (i in arr) {
            if (arr.hasOwnProperty(i)) {
                sortKeys[0].push(i);
                sortArrs[0].push(arr[i]);
            }
        }
    } else {
        return false;
    }

    // arrMainLength: Holds the length of the first array.
    // All other arrays must be of equal length, otherwise function would return FALSE like in PHP
    // sortComponents: Holds 2 indexes per every section of the array
    // that can be sorted. As this is the start, the whole array can be sorted.
    let arrMainLength = sortArrs[0].length;
    let sortComponents = [0, arrMainLength];

    // Loop through all other arguments, checking lengths and sort flags
    // of arrays and adding them to the above letiables.
    let argl = arguments.length;
    for (j = 1; j < argl; j++) {
        if (Object.prototype.toString.call(arguments[j]) === '[object Array]') {
            sortArrs[j] = arguments[j];
            sortFlag[j] = 0;
            if (arguments[j].length !== arrMainLength) {
                return false;
            }
        } else if (arguments[j] && typeof arguments[j] === 'object') {
            sortKeys[j] = [];
            sortArrs[j] = [];
            sortFlag[j] = 0;
            for (i in arguments[j]) {
                if (arguments[j].hasOwnProperty(i)) {
                    sortKeys[j].push(i);
                    sortArrs[j].push(arguments[j][i]);
                }
            }
            if (sortArrs[j].length !== arrMainLength) {
                return false;
            }
        } else if (typeof arguments[j] === 'string') {
            let lFlag = sortFlag.pop();
            // Keep extra parentheses around latter flags check
            // to avoid minimization leading to CDATA closer
            if (typeof flags[arguments[j]] === 'undefined' ||
                ((((flags[arguments[j]]) >>> 4) & (lFlag >>> 4)) > 0)) {
                return false;
            }
            sortFlag.push(lFlag + flags[arguments[j]]);
        } else {
            return false;
        }
    }

    for (i = 0; i !== arrMainLength; i++) {
        thingsToSort.push(true);
    }

    // Sort all the arrays....
    for (i in sortArrs) {
        if (sortArrs.hasOwnProperty(i)) {
            lastSorts = [];
            tmpArray = [];
            elIndex = 0;
            nLastSort = [];
            lastSort = [];

            // If there are no sortComponents, then no more sorting is neeeded.
            // Copy the array back to the argument.
            if (sortComponents.length === 0) {
                if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
                    args[i] = sortArrs[i];
                } else {
                    for (k in arguments[i]) {
                        if (arguments[i].hasOwnProperty(k)) {
                            delete arguments[i][k];
                        }
                    }
                    sal = sortArrs[i].length;
                    for (j = 0, vkey = 0; j < sal; j++) {
                        vkey = sortKeys[i][j];
                        args[i][vkey] = sortArrs[i][j];
                    }
                }
                sortArrs.splice(i, 1);
                sortKeys.splice(i, 1);
                continue;
            }

            // Sort function for sorting. Either sorts asc or desc, regular/string or numeric.
            let sFunction = sortFunctions[(sortFlag[i] & 3)][((sortFlag[i] & 8) > 0) ? 1 : 0];

            // Sort current array.
            for (l = 0; l !== sortComponents.length; l += 2) {
                tmpArray = sortArrs[i].slice(sortComponents[l], sortComponents[l + 1] + 1);
                tmpArray.sort(sFunction);
                // Is there a better way to copy an array in Javascript?
                lastSorts[l] = [].concat(lastSort);
                elIndex = sortComponents[l];
                for (g in tmpArray) {
                    if (tmpArray.hasOwnProperty(g)) {
                        sortArrs[i][elIndex] = tmpArray[g];
                        elIndex++;
                    }
                }
            }

            // Duplicate the sorting of the current array on future arrays.
            sFunction = sortDuplicator;
            for (j in sortArrs) {
                if (sortArrs.hasOwnProperty(j)) {
                    if (sortArrs[j] === sortArrs[i]) {
                        continue;
                    }
                    for (l = 0; l !== sortComponents.length; l += 2) {
                        tmpArray = sortArrs[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
                        nLastSort = [].concat(lastSorts[l]);
                        tmpArray.sort(sFunction);
                        elIndex = sortComponents[l];
                        for (g in tmpArray) {
                            if (tmpArray.hasOwnProperty(g)) {
                                sortArrs[j][elIndex] = tmpArray[g];
                                elIndex++;
                            }
                        }
                    }
                }
            }

            // Duplicate the sorting of the current array on array keys
            for (j in sortKeys) {
                if (sortKeys.hasOwnProperty(j)) {
                    for (l = 0; l !== sortComponents.length; l += 2) {
                        tmpArray = sortKeys[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
                        nLastSort = [].concat(lastSorts[l]);
                        tmpArray.sort(sFunction);
                        elIndex = sortComponents[l];
                        for (g in tmpArray) {
                            if (tmpArray.hasOwnProperty(g)) {
                                sortKeys[j][elIndex] = tmpArray[g];
                                elIndex++;
                            }
                        }
                    }
                }
            }

            // Generate the next sortComponents
            zlast = null;
            sortComponents = [];
            for (j in sortArrs[i]) {
                if (sortArrs[i].hasOwnProperty(j)) {
                    if (!thingsToSort[j]) {
                        if ((sortComponents.length & 1)) {
                            sortComponents.push(j - 1);
                        }
                        zlast = null;
                        continue;
                    }
                    if (!(sortComponents.length & 1)) {
                        if (zlast !== null) {
                            if (sortArrs[i][j] === zlast) {
                                sortComponents.push(j - 1);
                            } else {
                                thingsToSort[j] = false;
                            }
                        }
                        zlast = sortArrs[i][j];
                    } else {
                        if (sortArrs[i][j] !== zlast) {
                            sortComponents.push(j - 1);
                            zlast = sortArrs[i][j];
                        }
                    }
                }
            }

            if (sortComponents.length & 1) {
                sortComponents.push(j);
            }
            if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
                args[i] = sortArrs[i];
            } else {
                for (j in arguments[i]) {
                    if (arguments[i].hasOwnProperty(j)) {
                        delete arguments[i][j];
                    }
                }

                sal = sortArrs[i].length
                for (j = 0, vkey = 0; j < sal; j++) {
                    vkey = sortKeys[i][j];
                    args[i][vkey] = sortArrs[i][j];
                }
            }
            sortArrs.splice(i, 1);
            sortKeys.splice(i, 1);
        }
    }
    return true;
}

/*
    ----- Merge one or more arrays recursively -----
    //   example 1: let $arr1 = {'color': {'favorite': 'red'}, 0: 5}
    //   example 1: let $arr2 = {0: 10, 'color': {'favorite': 'green', 0: 'blue'}}
    //   example 1: array_merge_recursive($arr1, $arr2)
    //   returns 1: {'color': {'favorite': {0: 'red', 1: 'green'}, 0: 'blue'}, 1: 5, 1: 10}
*/
__Array.array_merge_recursive = function (arr1, arr2) {
    let idx = '';

    if (arr1 && Object.prototype.toString.call(arr1) === '[object Array]' &&
        arr2 && Object.prototype.toString.call(arr2) === '[object Array]') {
        for (idx in arr2) {
            arr1.push(arr2[idx]);
        }
    } else if ((arr1 && (arr1 instanceof Object)) && (arr2 && (arr2 instanceof Object))) {
        for (idx in arr2) {
            if (idx in arr1) {
                if (typeof arr1[idx] === 'object' && typeof arr2 === 'object') {
                    arr1[idx] = this.array_merge(arr1[idx], arr2[idx]);
                } else {
                    arr1[idx] = arr2[idx];
                }
            } else {
                arr1[idx] = arr2[idx];
            }
        }
    }

    return arr1;
}

/*
    ----- Merge one or more arrays -----
    //   example 1: let $arr1 = {"color": "red", 0: 2, 1: 4}
    //   example 1: let $arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
    //   example 1: array_merge($arr1, $arr2)
    //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
    //   example 2: let $arr1 = []
    //   example 2: let $arr2 = {1: "data"}
    //   example 2: array_merge($arr1, $arr2)
    //   returns 2: {0: "data"}
*/
__Array.array_merge = function (param) {
    let args = Array.prototype.slice.call(arguments);
    let argl = args.length;
    let arg;
    let retObj = {};
    let k = '';
    let argil = 0;
    let j = 0;
    let i = 0;
    let ct = 0;
    let toStr = Object.prototype.toString;
    let retArr = true;

    for (i = 0; i < argl; i++) {
        if (toStr.call(args[i]) !== '[object Array]') {
            retArr = false;
            break;
        }
    }

    if (retArr) {
        retArr = [];
        for (i = 0; i < argl; i++) {
            retArr = retArr.concat(args[i]);
        }
        return retArr;
    }

    for (i = 0, ct = 0; i < argl; i++) {
        arg = args[i];
        if (toStr.call(arg) === '[object Array]') {
            for (j = 0, argil = arg.length; j < argil; j++) {
                retObj[ct++] = arg[j];
            }
        } else {
            for (k in arg) {
                if (arg.hasOwnProperty(k)) {
                    if (parseInt(k, 10) + '' === k) {
                        retObj[ct++] = arg[k];
                    } else {
                        retObj[k] = arg[k];
                    }
                }
            }
        }
    }

    return retObj;
}

/*
    ----- Returns an array containing all the elements of array1 after applying the callback function to each one. -----
    //   example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] )
    //   returns 1: [ 1, 8, 27, 64, 125 ]
*/
__Array.array_map = function (callback) {
    let argc = arguments.length;
    let argv = arguments;
    let obj = null;
    let cb = callback;
    let j = argv[1].length;
    let i = 0;
    let k = 1;
    let m = 0;
    let tmp = [];
    let tmpArr = [];

    let $global = (typeof window !== 'undefined' ? window : global);

    while (i < j) {
        while (k < argc) {
            tmp[m++] = argv[k++][i];
        }

        m = 0;
        k = 1;

        if (callback) {
            if (typeof callback === 'string') {
                cb = $global[callback];
            } else if (typeof callback === 'object' && callback.length) {
                obj = typeof callback[0] === 'string' ? $global[callback[0]] : callback[0];
                if (typeof obj === 'undefined') {
                    throw new Error('Object not found: ' + callback[0]);
                }
                cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1];
            }
            tmpArr[i++] = cb.apply(obj, tmp);
        } else {
            tmpArr[i++] = tmp;
        }

        tmp = [];
    }

    return tmpArr;
}

/*
    ----- Get key of Array/Object and return array -----
    //   example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} )
    //   returns 1: [ 'firstname', 'surname' ]
*/
__Array.array_keys = function (input, searchValue, argStrict) {
    let search = typeof searchValue !== 'undefined';
    let tmpArr = [];
    let strict = !!argStrict;
    let include = true;
    let key = '';

    for (key in input) {
        if (input.hasOwnProperty(key)) {
            include = true;
            if (search) {
                if (strict && input[key] !== searchValue) {
                    include = false;
                } else if (input[key] !== searchValue) {
                    include = false;
                }
            }

            if (include) {
                tmpArr[tmpArr.length] = key;
            }
        }
    }

    return tmpArr;
}

/*
    ----- Check key exist in Array/Object -----
    //   example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'})
    //   returns 1: true
*/
__Array.array_key_exists = function (key, search) {
    if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
    }

    return key in search;
}

/*
    ----- Get item same bettween arrays with key and callback function -----
    //   example 1: let $array1 = {blue: 1, red: 2, green: 3, purple: 4}
    //   example 1: let $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
    //   example 1: array_intersect_ukey ($array1, $array2, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
    //   returns 1: {blue: 1, green: 3}
*/
__Array.array_intersect_ukey = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let arglm2 = arglm1 - 1;
    let cb = arguments[arglm1];
    let k1 = '';
    let i = 1;
    let k = '';
    let arr = {};

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (cb(k, k1) === 0) {
                    if (i === arglm2) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}

/*
    ----- Returns the values of array1 whose values exist in all of the arguments. -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
    //   example 1: array_intersect_uassoc($array1, $array2, function (f_string1, f_string2){let string1 = (f_string1+'').toLowerCase(); let string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
    //   returns 1: {b: 'brown'}
*/
__Array.array_intersect_uassoc = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let arglm2 = arglm1 - 1;
    let cb = arguments[arglm1];
    let k1 = '';
    let i = 1;
    let k = '';
    let arr = {};

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
                    if (i === arglm2) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}


/*
    ----- Get item same bettween arrays with key -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
    //   example 1: array_intersect_key($array1, $array2)
    //   returns 1: {0: 'red', a: 'green'}
*/
__Array.array_intersect_key = function (arr1) {
    let retArr = {};
    let argl = arguments.length;
    let arglm1 = argl - 1;
    let k1 = '';
    let arr = {};
    let i = 0;
    let k = '';

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        if (!arr1.hasOwnProperty(k1)) {
            continue;
        }
        arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (!arr.hasOwnProperty(k)) {
                    continue;
                }
                if (k === k1) {
                    if (i === arglm1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}

/*
    ----- Get item same bettween arrays with key and value -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
    //   example 1: array_intersect_assoc($array1, $array2)
    //   returns 1: {a: 'green'}
*/
__Array.array_intersect_assoc = function (arr1) {
    let retArr = {};
    let argl = arguments.length;
    let arglm1 = argl - 1;
    let k1 = '';
    let arr = {};
    let i = 0;
    let k = '';

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1] && k === k1) {
                    if (i === arglm1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}

/*
    ----- Get item same bettween arrays with value -----
    //   example 1: let $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
    //   example 1: let $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
    //   example 1: let $array3 = ['green', 'red']
    //   example 1: let $result = array_intersect($array1, $array2, $array3)
    //   returns 1: {0: 'red', a: 'green'}
*/
__Array.array_intersect = function (arr1) {
    let retArr = {};
    let argl = arguments.length;
    let arglm1 = argl - 1;
    let k1 = '';
    let arr = {};
    let i = 0;
    let k = '';

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    if (i === arglm1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value,
                    // continue the loop until done
                    continue arrs; // eslint-disable-line no-labels
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys; // eslint-disable-line no-labels
        }
    }

    return retArr;
}

/*
    ----- Convert value to key of array -----
    //   example 1: array_flip( {a: 1, b: 1, c: 2} )
    //   returns 1: {1: 'b', 2: 'c'}
*/
__Array.array_flip = function (trans) {
    let key;
    let tmpArr = {};

    for (key in trans) {
        if (!trans.hasOwnProperty(key)) {
            continue;
        }
        tmpArr[trans[key]] = key;
    }

    return tmpArr;
}

/*
    ----- Filters elements of an array using a callback function -----
    //   example 1: let odd = function (num) {return (num & 1);}
    //   example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
    //   returns 1: {"a": 1, "c": 3, "e": 5}
    //   example 2: let even = function (num) {return (!(num & 1));}
    //   example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
    //   returns 2: [ 6, , 8, , 10, , 12 ]
    //   example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
    //   returns 3: {"a":1, "c":-1}
*/
__Array.array_filter = function (arr, func) {
    let retObj = {};
    let k;

    func = func || function (v) {
        return v;
    }

    // @todo: Issue #73
    if (Object.prototype.toString.call(arr) === '[object Array]') {
        retObj = [];
    }

    for (k in arr) {
        if (func(arr[k])) {
            retObj[k] = arr[k];
        }
    }

    return retObj;
}

/*
    ----- Get value of argument 1 to key of object return and value is argument 2 -----
    //   example 1: let $keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
    //   example 1: array_fill_keys($keys, 'banana')
    //   returns 1: {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"} 
*/
__Array.array_fill_keys = function (keys, value) {
    let retObj = {};
    let key = '';

    for (key in keys) {
        retObj[keys[key]] = value;
    }

    return retObj;
}

/*
    ----- Fill an array with values -----
    //   example 1: array_fill(5, 6, 'banana')
    //   returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }
    //   example 2: array_fill(-2, 4, 'pear')
    //   returns 2: { -2: 'pear', 0: 'pear', 1: 'pear', 2: 'pear' }
*/
__Array.array_fill = function (startIndex, num, mixedVal) {
    let key;
    let tmpArr = {};

    if (!isNaN(startIndex) && !isNaN(num)) {
        for (key = 0; key < num; key++) {
            tmpArr[(key + startIndex)] = mixedVal;
        }
    }

    return tmpArr;
}

/*
    ----- Return item of argument 1 with key not in other argument -----
    //   example 1: let $array1 = {blue: 1, red: 2, green: 3, purple: 4}
    //   example 1: let $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
    //   example 1: array_diff_ukey($array1, $array2, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
    //   returns 1: {red: 2, purple: 4}
*/
__Array.array_diff_ukey = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let cb = arguments[arglm1];
    let k1 = '';
    let i = 1;
    let arr = {};
    let k = '';

    let $global = (typeof window !== 'undefined' ? window : global)

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < arglm1; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (cb(k, k1) === 0) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/*
    ----- Compare key of agrument 1 with other agrument and get item difference of agrument 1 -----
    //   example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
    //   example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
    //   example 1: array_diff_uassoc($array1, $array2, function (key1, key2) { return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)) })
    //   returns 1: {b: 'brown', c: 'blue', 0: 'red'}
*/
__Array.array_diff_uassoc = function (arr1) {
    let retArr = {};
    let arglm1 = arguments.length - 1;
    let cb = arguments[arglm1];
    let arr = {};
    let i = 1;
    let k1 = '';
    let k = '';

    let $global = (typeof window !== 'undefined' ? window : global);

    cb = (typeof cb === 'string')
        ? $global[cb]
        : (Object.prototype.toString.call(cb) === '[object Array]')
            ? $global[cb[0]][cb[1]]
            : cb;

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < arglm1; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/*
    ----- Compare key and value of agrument 1 with other agrument and get item difference of agrument 1 -----
    //   example 1: array_diff_assoc({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'})
    //   returns 1: {1: 'van', 2: 'Zonneveld'}
*/
__Array.array_diff_assoc = function (arr1) {
    let retArr = {};
    let argl = arguments.length;
    let k1 = '';
    let i = 1;
    let k = '';
    let arr = {};

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < argl; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1] && k === k1) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

/*
    ----- Get item difference bettwen of arrays -----
    //   example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld'])
    //   returns 1: {0:'Kevin'}
*/
__Array.array_diff = function (arr1) {
    let retArr = {};
    let argl = arguments.length;
    let k1 = '';
    let i = 1;
    let k = '';
    let arr = {};

    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
        for (i = 1; i < argl; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys; // eslint-disable-line no-labels
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}


/*
    ----- Count value of Array/Object -----
    //   example 1: array_count_values([ 3, 5, 3, "foo", "bar", "foo" ])
    //   returns 1: {3:2, 5:1, "foo":2, "bar":1}
    //   example 2: array_count_values({ p1: 3, p2: 5, p3: 3, p4: "foo", p5: "bar", p6: "foo" })
    //   returns 2: {3:2, 5:1, "foo":2, "bar":1}
    //   example 3: array_count_values([ true, 4.2, 42, "fubar" ])
    //   returns 3: {42:1, "fubar":1}
*/
__Array.array_count_values = function (array) {
    let tmpArr = {};
    let key = '';
    let t = '';

    let _getType = function (obj) {
        // Objects are php associative arrays.
        let t = typeof obj;
        t = t.toLowerCase();
        if (t === 'object') {
            t = 'array';
        }
        return t;
    }

    let _countValue = function (tmpArr, value) {
        if (typeof value === 'number') {
            if (Math.floor(value) !== value) {
                return;
            }
        } else if (typeof value !== 'string') {
            return;
        }

        if (value in tmpArr && tmpArr.hasOwnProperty(value)) {
            ++tmpArr[value];
        } else {
            tmpArr[value] = 1;
        }
    }

    t = _getType(array);
    if (t === 'array') {
        for (key in array) {
            if (array.hasOwnProperty(key)) {
                _countValue.call(this, tmpArr, array[key]);
            }
        }
    }

    return tmpArr;
}

/*
    ----- Merge two Array and get value of first array to key of obiect return, get value of second array to value of obiect return -----
    //   example 1: array_combine([0,1,2], ['kevin','van','zonneveld'])
    //   returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}
*/
__Array.array_combine = function (keys, values) {
    let newArray = {};
    let i = 0;

    // input sanitation
    // Only accept arrays or array-like objects
    // Require arrays to have a count
    if (typeof keys !== 'object') {
        return false;
    }
    if (typeof values !== 'object') {
        return false;
    }
    if (typeof keys.length !== 'number') {
        return false;
    }
    if (typeof values.length !== 'number') {
        return false;
    }
    if (!keys.length) {
        return false;
    }

    // number of elements does not match
    if (keys.length !== values.length) {
        return false;
    }

    for (i = 0; i < keys.length; i++) {
        newArray[keys[i]] = values[i];
    }

    return newArray;
}

/*
    ----- Split Array/Object by index and return Array/Object -----
    //   example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2)
    //   returns 1: [['Kevin', 'van'], ['Zonneveld']]
    //   example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true)
    //   returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
    //   example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2)
    //   returns 3: [['Kevin', 'van'], ['Zonneveld']]
    //   example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true)
    //   returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]
*/
__Array.array_chunk = function (input, size, preserveKeys) {
    let x;
    let p = '';
    let i = 0;
    let c = -1;
    let l = input.length || 0;
    let n = [];

    if (size < 1) {
        return null;
    }

    if (Object.prototype.toString.call(input) === '[object Array]') {
        if (preserveKeys) {
            while (i < l) {
                (x = i % size)
                    ? n[c][i] = input[i]
                    : n[++c] = {};
                n[c][i] = input[i];
                i++;
            }
        } else {
            while (i < l) {
                (x = i % size)
                    ? n[c][x] = input[i]
                    : n[++c] = [input[i]];
                i++;
            }
        }
    } else {
        if (preserveKeys) {
            for (p in input) {
                if (input.hasOwnProperty(p)) {
                    (x = i % size)
                        ? n[c][p] = input[p]
                        : n[++c] = {};
                    n[c][p] = input[p];
                    i++;
                }
            }
        } else {
            for (p in input) {
                if (input.hasOwnProperty(p)) {
                    (x = i % size)
                        ? n[c][x] = input[p]
                        : n[++c] = [input[p]];
                    i++;
                }
            }
        }
    }

    return n;
}

/*
    ----- Convert key of object to CASE_LOWER or CASE_UPPER -----
    example 1: array_change_key_case(42)
    returns 1: false
    example 2: array_change_key_case([ 3, 5 ])
    returns 2: [3, 5]
    example 3: array_change_key_case({ FuBaR: 42 })
    returns 3: {"fubar": 42}
    example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER')
    returns 4: {"fubar": 42}
    example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER')
    returns 5: {"FUBAR": 42}
    example 6: array_change_key_case({ FuBaR: 42 }, 2)
    returns 6: {"FUBAR": 42}
*/
__Array.array_change_key_case = function (array, cs) {
    let caseFnc;
    let key;
    let tmpArr = {};

    if (Object.prototype.toString.call(array) === '[object Array]') {
        return array;
    }

    if (array && typeof array === 'object') {
        caseFnc = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase';
        for (key in array) {
            tmpArr[key[caseFnc]()] = array[key];
        }
        return tmpArr;
    }

    return false;
}

/* -------------------------------------------------------- END ARRAY -------------------------------------------------------- */




__._array = __Array;




/* -------------------------------------------------------- STRING -------------------------------------------------------- */
var __String = {};


/*
    ----- Calculate the md5 hash of a string -----
    //   example 1: md5('Kevin van Zonneveld')
    //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
*/
__String.md5 = function (str) {
    let hash;
    try {
        let crypto = require('crypto');
        let md5sum = crypto.createHash('md5');
        md5sum.update(str);
        hash = md5sum.digest('hex');
    } catch (e) {
        hash = undefined;
    }

    if (hash !== undefined) {
        return hash;
    }

    let xl;

    let _rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    let _addUnsigned = function (lX, lY) {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    let _F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    }
    let _G = function (x, y, z) {
        return (x & z) | (y & (~z));
    }
    let _H = function (x, y, z) {
        return (x ^ y ^ z);
    }
    let _I = function (x, y, z) {
        return (y ^ (x | (~z)));
    }

    let _FF = function (a, b, c, d, x, s, ac) {
        a = _addUnsigned(a, _addUnsigned(_addUnsigned(_F(b, c, d), x), ac));
        return _addUnsigned(_rotateLeft(a, s), b);
    }

    let _GG = function (a, b, c, d, x, s, ac) {
        a = _addUnsigned(a, _addUnsigned(_addUnsigned(_G(b, c, d), x), ac));
        return _addUnsigned(_rotateLeft(a, s), b);
    }

    let _HH = function (a, b, c, d, x, s, ac) {
        a = _addUnsigned(a, _addUnsigned(_addUnsigned(_H(b, c, d), x), ac));
        return _addUnsigned(_rotateLeft(a, s), b);
    }

    let _II = function (a, b, c, d, x, s, ac) {
        a = _addUnsigned(a, _addUnsigned(_addUnsigned(_I(b, c, d), x), ac));
        return _addUnsigned(_rotateLeft(a, s), b);
    }

    let _convertToWordArray = function (str) {
        let lWordCount;
        let lMessageLength = str.length;
        let lNumberOfWordsTemp1 = lMessageLength + 8;
        let lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
        let lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
        let lWordArray = new Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] |
                (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    let _wordToHex = function (lValue) {
        let wordToHexValue = '';
        let wordToHexValueTemp = '';
        let lByte;
        let lCount;

        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValueTemp = '0' + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
        }
        return wordToHexValue;
    }

    let x = [];
    let k;
    let AA;
    let BB;
    let CC;
    let DD;
    let a;
    let b;
    let c;
    let d;
    let S11 = 7;
    let S12 = 12;
    let S13 = 17;
    let S14 = 22;
    let S21 = 5;
    let S22 = 9;
    let S23 = 14;
    let S24 = 20;
    let S31 = 4;
    let S32 = 11;
    let S33 = 16;
    let S34 = 23;
    let S41 = 6;
    let S42 = 10;
    let S43 = 15;
    let S44 = 21;

    str = __Xml.utf8_encode(str);
    x = _convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = _addUnsigned(a, AA);
        b = _addUnsigned(b, BB);
        c = _addUnsigned(c, CC);
        d = _addUnsigned(d, DD);
    }

    let temp = _wordToHex(a) + _wordToHex(b) + _wordToHex(c) + _wordToHex(d);

    return temp.toLowerCase();
}

/*
    ----- Strip whitespace (or other characters) from the beginning of a string -----
    //   example 1: ltrim('    Kevin van Zonneveld    ')
    //   returns 1: 'Kevin van Zonneveld    '
*/
__String.ltrim = function (str, charlist) {
    charlist = !charlist
        ? ' \\s\u00A0'
        : (charlist + '')
        .replace(/([[\]().?/*{}+$^:])/g, '$1');

    let re = new RegExp('^[' + charlist + ']+', 'g');

    return (str + '')
        .replace(re, '');
}

/*
    ----- Parse a time/date generated with strftime() -----
    //   example 1: setlocale('LC_ALL', 'en_US')
    //   returns 1: 'en_US''
*/
__String.setlocale = function (category, locale) {
    let getenv = __Info.getenv;
    //let getenv = require('../info/getenv')
    let categ = '';
    let cats = [];
    let i = 0;

    let _copy = function _copy (orig) {
        if (orig instanceof RegExp) {
            return new RegExp(orig);
        } else if (orig instanceof Date) {
            return new Date(orig);
        }
        let newObj = {};
        for (let i in orig) {
            if (typeof orig[i] === 'object') {
                newObj[i] = _copy(orig[i]);
            } else {
                newObj[i] = orig[i];
            }
        }
        return newObj;
    };

    let _nplurals2a = function (n) {
        // e.g., English
        return n !== 1 ? 1 : 0;
    };
    let _nplurals2b = function (n) {
        // e.g., French
        return n > 1 ? 1 : 0
    };

    var $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    var $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};

    // Reconcile Windows vs. *nix locale names?
    // Allow different priority orders of languages, esp. if implement gettext as in
    // LANGUAGE env. var.? (e.g., show German if French is not available)
    if (!$locutus.php.locales ||
        !$locutus.php.locales.fr_CA ||
        !$locutus.php.locales.fr_CA.LC_TIME ||
        !$locutus.php.locales.fr_CA.LC_TIME.x) 
    {
        // Can add to the locales
        $locutus.php.locales = {};

        $locutus.php.locales.en = {
            'LC_COLLATE': function (str1, str2) {
                // @todo: This one taken from strcmp, but need for other locales; we don't use localeCompare
                // since its locale is not settable
                return (str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1);
            },
            'LC_CTYPE': {
                // Need to change any of these for English as opposed to C?
                an: /^[A-Za-z\d]+$/g,
                al: /^[A-Za-z]+$/g,
                ct: /^[\u0000-\u001F\u007F]+$/g,
                dg: /^[\d]+$/g,
                gr: /^[\u0021-\u007E]+$/g,
                lw: /^[a-z]+$/g,
                pr: /^[\u0020-\u007E]+$/g,
                pu: /^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
                sp: /^[\f\n\r\t\v ]+$/g,
                up: /^[A-Z]+$/g,
                xd: /^[A-Fa-f\d]+$/g,
                CODESET: 'UTF-8',
                // Used by sql_regcase
                lower: 'abcdefghijklmnopqrstuvwxyz',
                upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            },
            'LC_TIME': {
                // Comments include nl_langinfo() constant equivalents and any
                // changes from Blues' implementation
                a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                // ABDAY_
                A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                // DAY_
                b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                // ABMON_
                B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                // MON_
                c: '%a %d %b %Y %r %Z',
                // D_T_FMT // changed %T to %r per results
                p: ['AM', 'PM'],
                // AM_STR/PM_STR
                P: ['am', 'pm'],
                // Not available in nl_langinfo()
                r: '%I:%M:%S %p',
                // T_FMT_AMPM (Fixed for all locales)
                x: '%m/%d/%Y',
                // D_FMT // switched order of %m and %d; changed %y to %Y (C uses %y)
                X: '%r',
                // T_FMT // changed from %T to %r  (%T is default for C, not English US)
                // Following are from nl_langinfo() or http://www.cptec.inpe.br/sx4/sx4man2/g1ab02e/strftime.4.html
                alt_digits: '',
                // e.g., ordinal
                ERA: '',
                ERA_YEAR: '',
                ERA_D_T_FMT: '',
                ERA_D_FMT: '',
                ERA_T_FMT: ''
            },
            // Assuming distinction between numeric and monetary is thus:
            // See below for C locale
            'LC_MONETARY': {
                // based on Windows "english" (English_United States.1252) locale
                int_curr_symbol: 'USD',
                currency_symbol: '$',
                mon_decimal_point: '.',
                mon_thousands_sep: ',',
                mon_grouping: [3],
                // use mon_thousands_sep; "" for no grouping; additional array members
                // indicate successive group lengths after first group
                // (e.g., if to be 1,23,456, could be [3, 2])
                positive_sign: '',
                negative_sign: '-',
                int_frac_digits: 2,
                // Fractional digits only for money defaults?
                frac_digits: 2,
                p_cs_precedes: 1,
                // positive currency symbol follows value = 0; precedes value = 1
                p_sep_by_space: 0,
                // 0: no space between curr. symbol and value; 1: space sep. them unless symb.
                // and sign are adjacent then space sep. them from value; 2: space sep. sign
                // and value unless symb. and sign are adjacent then space separates
                n_cs_precedes: 1,
                // see p_cs_precedes
                n_sep_by_space: 0,
                // see p_sep_by_space
                p_sign_posn: 3,
                // 0: parentheses surround quantity and curr. symbol; 1: sign precedes them;
                // 2: sign follows them; 3: sign immed. precedes curr. symbol; 4: sign immed.
                // succeeds curr. symbol
                n_sign_posn: 0 // see p_sign_posn
            },
            'LC_NUMERIC': {
                // based on Windows "english" (English_United States.1252) locale
                decimal_point: '.',
                thousands_sep: ',',
                grouping: [3] // see mon_grouping, but for non-monetary values (use thousands_sep)
            },
            'LC_MESSAGES': {
                YESEXPR: '^[yY].*',
                NOEXPR: '^[nN].*',
                YESSTR: '',
                NOSTR: ''
            },
            nplurals: _nplurals2a
        }

        $locutus.php.locales.en_US = _copy($locutus.php.locales.en);
        $locutus.php.locales.en_US.LC_TIME.c = '%a %d %b %Y %r %Z';
        $locutus.php.locales.en_US.LC_TIME.x = '%D';
        $locutus.php.locales.en_US.LC_TIME.X = '%r';
        // The following are based on *nix settings
        $locutus.php.locales.en_US.LC_MONETARY.int_curr_symbol = 'USD ';
        $locutus.php.locales.en_US.LC_MONETARY.p_sign_posn = 1;
        $locutus.php.locales.en_US.LC_MONETARY.n_sign_posn = 1;
        $locutus.php.locales.en_US.LC_MONETARY.mon_grouping = [3, 3];
        $locutus.php.locales.en_US.LC_NUMERIC.thousands_sep = '';
        $locutus.php.locales.en_US.LC_NUMERIC.grouping = [];

        $locutus.php.locales.en_GB = _copy($locutus.php.locales.en);
        $locutus.php.locales.en_GB.LC_TIME.r = '%l:%M:%S %P %Z';

        $locutus.php.locales.en_AU = _copy($locutus.php.locales.en_GB);
        // Assume C locale is like English (?) (We need C locale for LC_CTYPE)
        $locutus.php.locales.C = _copy($locutus.php.locales.en);
        $locutus.php.locales.C.LC_CTYPE.CODESET = 'ANSI_X3.4-1968';

        $locutus.php.locales.C.LC_MONETARY = {
            int_curr_symbol: '',
            currency_symbol: '',
            mon_decimal_point: '',
            mon_thousands_sep: '',
            mon_grouping: [],
            p_cs_precedes: 127,
            p_sep_by_space: 127,
            n_cs_precedes: 127,
            n_sep_by_space: 127,
            p_sign_posn: 127,
            n_sign_posn: 127,
            positive_sign: '',
            negative_sign: '',
            int_frac_digits: 127,
            frac_digits: 127
        };
        $locutus.php.locales.C.LC_NUMERIC = {
            decimal_point: '.',
            thousands_sep: '',
            grouping: []
        };
        // D_T_FMT
        $locutus.php.locales.C.LC_TIME.c = '%a %b %e %H:%M:%S %Y';
        // D_FMT
        $locutus.php.locales.C.LC_TIME.x = '%m/%d/%y';
        // T_FMT
        $locutus.php.locales.C.LC_TIME.X = '%H:%M:%S';
        $locutus.php.locales.C.LC_MESSAGES.YESEXPR = '^[yY]';
        $locutus.php.locales.C.LC_MESSAGES.NOEXPR = '^[nN]';

        $locutus.php.locales.fr = _copy($locutus.php.locales.en);
        $locutus.php.locales.fr.nplurals = _nplurals2b;
        $locutus.php.locales.fr.LC_TIME.a = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
        $locutus.php.locales.fr.LC_TIME.A = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $locutus.php.locales.fr.LC_TIME.b = ['jan', 'f\u00E9v', 'mar', 'avr', 'mai', 'jun', 'jui', 'ao\u00FB', 'sep', 'oct', 'nov', 'd\u00E9c'];
        $locutus.php.locales.fr.LC_TIME.B = ['janvier', 'f\u00E9vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao\u00FBt', 'septembre', 'octobre', 'novembre', 'd\u00E9cembre'];
        $locutus.php.locales.fr.LC_TIME.c = '%a %d %b %Y %T %Z';
        $locutus.php.locales.fr.LC_TIME.p = ['', ''];
        $locutus.php.locales.fr.LC_TIME.P = ['', ''];
        $locutus.php.locales.fr.LC_TIME.x = '%d.%m.%Y';
        $locutus.php.locales.fr.LC_TIME.X = '%T';

        $locutus.php.locales.fr_CA = _copy($locutus.php.locales.fr);
        $locutus.php.locales.fr_CA.LC_TIME.x = '%Y-%m-%d';
    }

    if (!$locutus.php.locale) {
        $locutus.php.locale = 'en_US';
        // Try to establish the locale via the `window` global
        if (typeof window !== 'undefined' && window.document) {
            var d = window.document
            var NS_XHTML = 'http://www.w3.org/1999/xhtml'
            var NS_XML = 'http://www.w3.org/XML/1998/namespace'
            if (d.getElementsByTagNameNS && d.getElementsByTagNameNS(NS_XHTML, 'html')[0]) {
                if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS &&
                    d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang')) 
                {
                    $locutus.php.locale = d.getElementsByTagName(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang');
                } else if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang) {
                    // XHTML 1.0 only
                    $locutus.php.locale = d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang;
                }
            } else if (d.getElementsByTagName('html')[0] &&
                d.getElementsByTagName('html')[0].lang) 
            {
                $locutus.php.locale = d.getElementsByTagName('html')[0].lang;
            }
        }
    }
    // PHP-style
    $locutus.php.locale = $locutus.php.locale.replace('-', '_');
    // @todo: locale if declared locale hasn't been defined
    if (!($locutus.php.locale in $locutus.php.locales)) {
        if ($locutus.php.locale.replace(/_[a-zA-Z]+$/, '') in $locutus.php.locales) {
            $locutus.php.locale = $locutus.php.locale.replace(/_[a-zA-Z]+$/, '');
        }
    }

    if (!$locutus.php.localeCategories) {
        $locutus.php.localeCategories = {
            'LC_COLLATE': $locutus.php.locale,
            // for string comparison, see strcoll()
            'LC_CTYPE': $locutus.php.locale,
            // for character classification and conversion, for example strtoupper()
            'LC_MONETARY': $locutus.php.locale,
            // for localeconv()
            'LC_NUMERIC': $locutus.php.locale,
            // for decimal separator (See also localeconv())
            'LC_TIME': $locutus.php.locale,
            // for date and time formatting with strftime()
            // for system responses (available if PHP was compiled with libintl):
            'LC_MESSAGES': $locutus.php.locale
        }
    }

    if (locale === null || locale === '') {
        locale = getenv(category) || getenv('LANG');
    } else if (Object.prototype.toString.call(locale) === '[object Array]') {
        for (i = 0; i < locale.length; i++) {
            if (!(locale[i] in $locutus.php.locales)) {
                if (i === locale.length - 1) {
                    // none found
                    return false;
                }
                continue;
            }
            locale = locale[i];
            break;
        }
    }

    // Just get the locale
    if (locale === '0' || locale === 0) {
        if (category === 'LC_ALL') {
            for (categ in $locutus.php.localeCategories) {
                // Add ".UTF-8" or allow ".@latint", etc. to the end?
                cats.push(categ + '=' + $locutus.php.localeCategories[categ]);
            }
            return cats.join(';');
        }
        return $locutus.php.localeCategories[category];
    }

    if (!(locale in $locutus.php.locales)) {
        // Locale not found
        return false
    }

    // Set and get locale
    if (category === 'LC_ALL') {
        for (categ in $locutus.php.localeCategories) {
            $locutus.php.localeCategories[categ] = locale;
        }
    } else {
        $locutus.php.localeCategories[category] = locale;
    }

    return locale;
}

/*
    ----- Get numeric formatting information -----
    //   example 1: localeconv()
    //   returns 1: {decimal_point: '.', thousands_sep: '', positive_sign: '', negative_sign: '-', int_frac_digits: 2, frac_digits: 2, p_cs_precedes: 1, p_sep_by_space: 0, n_cs_precedes: 1, n_sep_by_space: 0, p_sign_posn: 1, n_sign_posn: 1, grouping: [], int_curr_symbol: 'USD ', currency_symbol: '$', mon_decimal_point: '.', mon_thousands_sep: ',', mon_grouping: [3, 3]}
*/
__String.localeconv = function (param) {
    let arr = {};
    let prop = '';

    // ensure setup of localization letiables takes place, if not already
    this.setlocale('LC_ALL', 0);

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};

    // Make copies
    for (prop in $locutus.php.locales[$locutus.php.localeCategories.LC_NUMERIC].LC_NUMERIC) {
        arr[prop] = $locutus.php.locales[$locutus.php.localeCategories.LC_NUMERIC].LC_NUMERIC[prop];
    }
    for (prop in $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY].LC_MONETARY) {
        arr[prop] = $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY].LC_MONETARY[prop];
    }

    return arr;
}

/*
    ----- Calculate Levenshtein distance between two strings -----
    //        example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld')
    //        returns 1: 3
    //        example 2: levenshtein("carrrot", "carrots")
    //        returns 2: 2
    //        example 3: levenshtein("carrrot", "carrots", 2, 3, 4)
    //        returns 3: 6
*/
__String.levenshtein = function (s1, s2, costIns, costRep, costDel) {
    costIns = costIns == null ? 1 : +costIns;
    costRep = costRep == null ? 1 : +costRep;
    costDel = costDel == null ? 1 : +costDel;

    if (s1 === s2) {
        return 0;
    }

    let l1 = s1.length;
    let l2 = s2.length;

    if (l1 === 0) {
        return l2 * costIns;
    }
    if (l2 === 0) {
        return l1 * costDel;
    }

    let split = false;
    try {
        split = !('0')[0];
    } catch (e) {
        // Earlier IE may not support access by string index
        split = true;
    }

    if (split) {
        s1 = s1.split('');
        s2 = s2.split('');
    }

    let p1 = new Array(l2 + 1);
    let p2 = new Array(l2 + 1);

    let i1, i2, c0, c1, c2, tmp;

    for (i2 = 0; i2 <= l2; i2++) {
        p1[i2] = i2 * costIns;
    }

    for (i1 = 0; i1 < l1; i1++) {
        p2[0] = p1[0] + costDel;

        for (i2 = 0; i2 < l2; i2++) {
            c0 = p1[i2] + ((s1[i1] === s2[i2]) ? 0 : costRep);
            c1 = p1[i2 + 1] + costDel;
            if (c1 < c0) {
                c0 = c1;
            }

            c2 = p2[i2] + costIns;

            if (c2 < c0) {
                c0 = c2;
            }

            p2[i2 + 1] = c0;
        }

        tmp = p1;
        p1 = p2;
        p2 = tmp;
    }

    c0 = p1[l2];

    return c0;
}

/*
    ----- Make a string's first character lowercase -----
    //   example 1: lcfirst('Kevin Van Zonneveld')
    //   returns 1: 'kevin Van Zonneveld'
*/
__String.lcfirst = function (str) {
    str += '';
    let f = str.charAt(0)
        .toLowerCase();
    return f + str.substr(1);
}

/*
    ----- Join array elements with a string -----
    //   example 1: join(' ', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'Kevin van Zonneveld'
*/
__String.join = function (glue, pieces) {
    return __String.implode(glue, pieces);
}

/*
    -----  Join array elements with a string -----
    //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
    //   returns 2: 'Kevin van Zonneveld'
*/
__String.implode = function (glue, pieces) {
    let i = '';
    let retVal = '';
    let tGlue = '';

    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }

    if (typeof pieces === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        for (i in pieces) {
            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }

    return pieces;
}

/*
    ----- Convert special HTML entities back to characters -----
    //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES')
    //        returns 1: '<p>this -> &quot;</p>'
    //        example 2: htmlspecialchars_decode("&amp;quot;")
    //        returns 2: '&quot;'
*/
__String.htmlspecialchars_decode = function (string, quoteStyle) {
    let optTemp = 0;
    let i = 0;
    let noquotes = false;

    if (typeof quoteStyle === 'undefined') {
        quoteStyle = 2;
    }
    string = string.toString()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    let OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quoteStyle === 0) {
        noquotes = true;
    }
    if (typeof quoteStyle !== 'number') {
        // Allow for a single string or an array of string flags
        quoteStyle = [].concat(quoteStyle);
        for (i = 0; i < quoteStyle.length; i++) {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quoteStyle[i]] === 0) {
                noquotes = true;
            } else if (OPTS[quoteStyle[i]]) {
                optTemp = optTemp | OPTS[quoteStyle[i]];
            }
        }
        quoteStyle = optTemp;
    }
    if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
        // PHP doesn't currently escape if more than one 0, but it should:
        string = string.replace(/&#0*39;/g, "'");
    }
    if (!noquotes) {
        string = string.replace(/&quot;/g, '"');
    }
    // Put this in last place to avoid escape being double-decoded
    string = string.replace(/&amp;/g, '&');

    return string;
}

/*
    ----- Convert special characters to HTML entities -----
    //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')
    //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES'])
    //        returns 2: 'ab"c&#039;d'
    //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false)
    //        returns 3: 'my &quot;&entity;&quot; is still here'
*/
__String.htmlspecialchars = function (string, quoteStyle, charset, doubleEncode) {
    let optTemp = 0;
    let i = 0;
    let noquotes = false;
    if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
        quoteStyle = 2;
    }
    string = string || '';
    string = string.toString();

    if (doubleEncode !== false) {
        // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }

    string = string
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    let OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quoteStyle === 0) {
        noquotes = true;
    }
    if (typeof quoteStyle !== 'number') {
        // Allow for a single string or an array of string flags
        quoteStyle = [].concat(quoteStyle);
        for (i = 0; i < quoteStyle.length; i++) {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quoteStyle[i]] === 0) {
                noquotes = true;
            } else if (OPTS[quoteStyle[i]]) {
                optTemp = optTemp | OPTS[quoteStyle[i]];
            }
        }
        quoteStyle = optTemp;
    }
    if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}

/*
    ----- Convert all applicable characters to HTML entities -----
    //   example 1: htmlentities('Kevin & van Zonneveld')
    //   returns 1: 'Kevin &amp; van Zonneveld'
    //   example 2: htmlentities("foo'bar","ENT_QUOTES")
    //   returns 2: 'foo&#039;bar'
*/
__String.htmlentities = function (string, quoteStyle, charset, doubleEncode) {
    let hashMap = __String.get_html_translation_table('HTML_ENTITIES', quoteStyle);

    string = string === null ? '' : string + '';

    if (!hashMap) {
        return false;
    }

    if (quoteStyle && quoteStyle === 'ENT_QUOTES') {
        hashMap["'"] = '&#039;';
    }

    doubleEncode = doubleEncode === null || !!doubleEncode;

    let regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' +
        Object.keys(hashMap)
        .join('')
        // replace regexp special chars
        .replace(/([()[\]{}\-.*+?^$|/\\])/g, '\\$1') +
        ']',
        'g');

    return string.replace(regex,
        function(ent) {
            if (ent.length > 1) {
                return doubleEncode ? hashMap['&'] + ent.substr(1) : ent;
            }

            return hashMap[ent];
        });
}

/*
    ----- Convert HTML entities to their corresponding characters -----
    //   example 1: html_entity_decode('Kevin &amp; van Zonneveld')
    //   returns 1: 'Kevin & van Zonneveld'
    //   example 2: html_entity_decode('&amp;lt;')
    //   returns 2: '&lt;'
*/
__String.html_entity_decode = function (string, quoteStyle) {
    let tmpStr = '';
    let entity = '';
    let symbol = '';
    tmpStr = string.toString();

    let hashMap = __String.get_html_translation_table('HTML_ENTITIES', quoteStyle);
    if (hashMap === false) {
        return false;
    }

    // @todo: &amp; problem
    // http://locutus.io/php/get_html_translation_table:416#comment_97660
    delete (hashMap['&']);
    hashMap['&'] = '&amp;';

    for (symbol in hashMap) {
        entity = hashMap[symbol];
        tmpStr = tmpStr.split(entity).join(symbol);
    }
    tmpStr = tmpStr.split('&#039;').join("'");

    return tmpStr;
}

/*
    ----- Decodes a hexadecimally encoded binary string -----
    //   example 1: hex2bin('44696d61')
    //   returns 1: 'Dima'
    //   example 2: hex2bin('00')
    //   returns 2: '\x00'
    //   example 3: hex2bin('2f1q')
    //   returns 3: false
*/
__String.hex2bin = function (s) {
    let ret = [];
    let i = 0;
    let l;

    s += '';

    for (l = s.length; i < l; i += 2) {
        let c = parseInt(s.substr(i, 1), 16);
        let k = parseInt(s.substr(i + 1, 1), 16);
        if (isNaN(c) || isNaN(k)) return false;
        ret.push((c << 4) | k);
    }

    return String.fromCharCode.apply(String, ret);
}

/*
    ----- Returns the translation table used by htmlspecialchars() and htmlentities() -----
    //   example 1: get_html_translation_table('HTML_SPECIALCHARS')
    //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
*/
__String.get_html_translation_table = function (table, quoteStyle) {
    let entities = {};
    let hashMap = {};
    let decimal;
    let constMappingTable = {};
    let constMappingQuoteStyle = {};
    let useTable = {};
    let useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable = !isNaN(table)
        ? constMappingTable[table]
        : table
        ? table.toUpperCase()
        : 'HTML_SPECIALCHARS';

    useQuoteStyle = !isNaN(quoteStyle)
        ? constMappingQuoteStyle[quoteStyle]
        : quoteStyle
        ? quoteStyle.toUpperCase()
        : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error('Table: ' + useTable + ' not supported');
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';

    // ascii decimals to real symbols
    for (decimal in entities) {
        if (entities.hasOwnProperty(decimal)) {
            hashMap[String.fromCharCode(decimal)] = entities[decimal];
        }
    }

    return hashMap;
}

/*
    ----- Split a string by a string -----
    //   example 1: explode(' ', 'Kevin van Zonneveld')
    //   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]
*/
__String.explode = function (delimiter, string, limit) {
    if (arguments.length < 2 ||
        typeof delimiter === 'undefined' ||
        typeof string === 'undefined') {
        return null;
    }
    if (delimiter === '' ||
        delimiter === false ||
        delimiter === null) {
        return false;
    }
    if (typeof delimiter === 'function' ||
        typeof delimiter === 'object' ||
        typeof string === 'function' ||
        typeof string === 'object') {
        return {
            0: ''
        };
    }
    if (delimiter === true) {
        delimiter = '1';
    }

    // Here we go...
    delimiter += '';
    string += '';

    let s = string.split(delimiter);

    if (typeof limit === 'undefined') return s;

    // Support for limit
    if (limit === 0) limit = 1;

    // Positive limit
    if (limit > 0) {
        if (limit >= s.length) {
            return s;
        }
        return s
            .slice(0, limit - 1)
            .concat([
                s.slice(limit - 1)
                .join(delimiter)
            ]);
    }

    // Negative limit
    if (-limit >= s.length) {
        return [];
    }

    s.splice(s.length + limit);
    return s;
}

/*
    ----- Calculates the crc32 polynomial of a string -----
    //   example 1: crc32('Kevin van Zonneveld')
    //   returns 1: 1249991249
*/
__String.crc32 = function (str) {
    str = __Xml.utf8_encode(str);
    let table = [
        '00000000',
        '77073096',
        'EE0E612C',
        '990951BA',
        '076DC419',
        '706AF48F',
        'E963A535',
        '9E6495A3',
        '0EDB8832',
        '79DCB8A4',
        'E0D5E91E',
        '97D2D988',
        '09B64C2B',
        '7EB17CBD',
        'E7B82D07',
        '90BF1D91',
        '1DB71064',
        '6AB020F2',
        'F3B97148',
        '84BE41DE',
        '1ADAD47D',
        '6DDDE4EB',
        'F4D4B551',
        '83D385C7',
        '136C9856',
        '646BA8C0',
        'FD62F97A',
        '8A65C9EC',
        '14015C4F',
        '63066CD9',
        'FA0F3D63',
        '8D080DF5',
        '3B6E20C8',
        '4C69105E',
        'D56041E4',
        'A2677172',
        '3C03E4D1',
        '4B04D447',
        'D20D85FD',
        'A50AB56B',
        '35B5A8FA',
        '42B2986C',
        'DBBBC9D6',
        'ACBCF940',
        '32D86CE3',
        '45DF5C75',
        'DCD60DCF',
        'ABD13D59',
        '26D930AC',
        '51DE003A',
        'C8D75180',
        'BFD06116',
        '21B4F4B5',
        '56B3C423',
        'CFBA9599',
        'B8BDA50F',
        '2802B89E',
        '5F058808',
        'C60CD9B2',
        'B10BE924',
        '2F6F7C87',
        '58684C11',
        'C1611DAB',
        'B6662D3D',
        '76DC4190',
        '01DB7106',
        '98D220BC',
        'EFD5102A',
        '71B18589',
        '06B6B51F',
        '9FBFE4A5',
        'E8B8D433',
        '7807C9A2',
        '0F00F934',
        '9609A88E',
        'E10E9818',
        '7F6A0DBB',
        '086D3D2D',
        '91646C97',
        'E6635C01',
        '6B6B51F4',
        '1C6C6162',
        '856530D8',
        'F262004E',
        '6C0695ED',
        '1B01A57B',
        '8208F4C1',
        'F50FC457',
        '65B0D9C6',
        '12B7E950',
        '8BBEB8EA',
        'FCB9887C',
        '62DD1DDF',
        '15DA2D49',
        '8CD37CF3',
        'FBD44C65',
        '4DB26158',
        '3AB551CE',
        'A3BC0074',
        'D4BB30E2',
        '4ADFA541',
        '3DD895D7',
        'A4D1C46D',
        'D3D6F4FB',
        '4369E96A',
        '346ED9FC',
        'AD678846',
        'DA60B8D0',
        '44042D73',
        '33031DE5',
        'AA0A4C5F',
        'DD0D7CC9',
        '5005713C',
        '270241AA',
        'BE0B1010',
        'C90C2086',
        '5768B525',
        '206F85B3',
        'B966D409',
        'CE61E49F',
        '5EDEF90E',
        '29D9C998',
        'B0D09822',
        'C7D7A8B4',
        '59B33D17',
        '2EB40D81',
        'B7BD5C3B',
        'C0BA6CAD',
        'EDB88320',
        '9ABFB3B6',
        '03B6E20C',
        '74B1D29A',
        'EAD54739',
        '9DD277AF',
        '04DB2615',
        '73DC1683',
        'E3630B12',
        '94643B84',
        '0D6D6A3E',
        '7A6A5AA8',
        'E40ECF0B',
        '9309FF9D',
        '0A00AE27',
        '7D079EB1',
        'F00F9344',
        '8708A3D2',
        '1E01F268',
        '6906C2FE',
        'F762575D',
        '806567CB',
        '196C3671',
        '6E6B06E7',
        'FED41B76',
        '89D32BE0',
        '10DA7A5A',
        '67DD4ACC',
        'F9B9DF6F',
        '8EBEEFF9',
        '17B7BE43',
        '60B08ED5',
        'D6D6A3E8',
        'A1D1937E',
        '38D8C2C4',
        '4FDFF252',
        'D1BB67F1',
        'A6BC5767',
        '3FB506DD',
        '48B2364B',
        'D80D2BDA',
        'AF0A1B4C',
        '36034AF6',
        '41047A60',
        'DF60EFC3',
        'A867DF55',
        '316E8EEF',
        '4669BE79',
        'CB61B38C',
        'BC66831A',
        '256FD2A0',
        '5268E236',
        'CC0C7795',
        'BB0B4703',
        '220216B9',
        '5505262F',
        'C5BA3BBE',
        'B2BD0B28',
        '2BB45A92',
        '5CB36A04',
        'C2D7FFA7',
        'B5D0CF31',
        '2CD99E8B',
        '5BDEAE1D',
        '9B64C2B0',
        'EC63F226',
        '756AA39C',
        '026D930A',
        '9C0906A9',
        'EB0E363F',
        '72076785',
        '05005713',
        '95BF4A82',
        'E2B87A14',
        '7BB12BAE',
        '0CB61B38',
        '92D28E9B',
        'E5D5BE0D',
        '7CDCEFB7',
        '0BDBDF21',
        '86D3D2D4',
        'F1D4E242',
        '68DDB3F8',
        '1FDA836E',
        '81BE16CD',
        'F6B9265B',
        '6FB077E1',
        '18B74777',
        '88085AE6',
        'FF0F6A70',
        '66063BCA',
        '11010B5C',
        '8F659EFF',
        'F862AE69',
        '616BFFD3',
        '166CCF45',
        'A00AE278',
        'D70DD2EE',
        '4E048354',
        '3903B3C2',
        'A7672661',
        'D06016F7',
        '4969474D',
        '3E6E77DB',
        'AED16A4A',
        'D9D65ADC',
        '40DF0B66',
        '37D83BF0',
        'A9BCAE53',
        'DEBB9EC5',
        '47B2CF7F',
        '30B5FFE9',
        'BDBDF21C',
        'CABAC28A',
        '53B39330',
        '24B4A3A6',
        'BAD03605',
        'CDD70693',
        '54DE5729',
        '23D967BF',
        'B3667A2E',
        'C4614AB8',
        '5D681B02',
        '2A6F2B94',
        'B40BBE37',
        'C30C8EA1',
        '5A05DF1B',
        '2D02EF8D'
    ].join(' ');
    // @todo: ^-- Now that `table` is an array, maybe we can use that directly using slices,
    // instead of converting it to a string and substringing

    let crc = 0;
    let x = 0;
    let y = 0;

    crc = crc ^ (-1);
    for (let i = 0, iTop = str.length; i < iTop; i++) {
        y = (crc ^ str.charCodeAt(i)) & 0xFF;
        x = '0x' + table.substr(y * 9, 8);
        crc = (crc >>> 8) ^ x;
    }

    return crc ^ (-1);
}

/*
    ----- Return information about characters used in a string -----
    //   example 1: count_chars("Hello World!", 3)
    //   returns 1: " !HWdelor"
    //   example 2: count_chars("Hello World!", 1)
    //   returns 2: {32:1,33:1,72:1,87:1,100:1,101:1,108:3,111:2,114:1}
*/
__String.count_chars = function (str, mode) {
    let result = {};
    let resultArr = [];
    let i;

    str = ('' + str)
        .split('')
        .sort()
        .join('')
        .match(/(.)\1*/g);

    if ((mode & 1) === 0) {
        for (i = 0; i !== 256; i++) {
            result[i] = 0;
        }
    }

    if (mode === 2 || mode === 4) {
        for (i = 0; i !== str.length; i += 1) {
            delete result[str[i].charCodeAt(0)];
        }
        for (i in result) {
            result[i] = (mode === 4) ? String.fromCharCode(i) : 0;
        }
    } else if (mode === 3) {
        for (i = 0; i !== str.length; i += 1) {
            result[i] = str[i].slice(0, 1);
        }
    } else {
        for (i = 0; i !== str.length; i += 1) {
            result[str[i].charCodeAt(0)] = str[i].length;
        }
    }
    if (mode < 3) {
        return result;
    }

    for (i in result) {
        resultArr.push(result[i]);
    }

    return resultArr.join('');
}

/*
    ----- Encodes a string using the uuencode algorithm. -----
    //        example 1: convert_uuencode("test\ntext text\r\n")
    //        returns 1: "0=&5S=`IT97AT('1E>'0-\"@\n`\n"
*/
__String.convert_uuencode = function (str) {
    let chr = function(c) {
        return String.fromCharCode(c);
    };

    if (!str || str === '') {
        return chr(0);
    } else if (!__let.is_scalar(str)) {
        return false;
    }

    let c = 0;
    let u = 0;
    let i = 0;
    let a = 0;
    let encoded = '';
    let tmp1 = '';
    let tmp2 = '';
    let bytes = {};

    // divide string into chunks of 45 characters
    let chunk = function() {
        bytes = str.substr(u, 45).split('');
        for (i in bytes) {
            bytes[i] = bytes[i].charCodeAt(0);
        }
        return bytes.length || 0;
    };

    while ((c = chunk()) !== 0) {
        u += 45;

        // New line encoded data starts with number of bytes encoded.
        encoded += chr(c + 32);

        // Convert each char in bytes[] to a byte
        for (i in bytes) {
            tmp1 = bytes[i].toString(2);
            while (tmp1.length < 8) {
                tmp1 = '0' + tmp1;
            }
            tmp2 += tmp1;
        }

        while (tmp2.length % 6) {
            tmp2 = tmp2 + '0';
        }

        for (i = 0; i <= (tmp2.length / 6) - 1; i++) {
            tmp1 = tmp2.substr(a, 6);
            if (tmp1 === '000000') {
                encoded += chr(96);
            } else {
                encoded += chr(parseInt(tmp1, 2) + 32);
            }
            a += 6;
        }
        a = 0;
        tmp2 = '';
        encoded += '\n';
    }

    // Add termination characters
    encoded += chr(96) + '\n';

    return encoded;
}

/*
    ----- Convert from one Cyrillic character set to another -----
    //   example 1: convert_cyr_string(String.fromCharCode(214), 'k', 'w').charCodeAt(0) === 230; // Char. 214 of KOI8-R gives equivalent number value 230 in win1251
    //   returns 1: true
*/
__String.convert_cyr_string = function (str, from, to) {
    let _cyrWin1251 = [
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        46,
        154,
        174,
        190,
        46,
        159,
        189,
        46,
        46,
        179,
        191,
        180,
        157,
        46,
        46,
        156,
        183,
        46,
        46,
        182,
        166,
        173,
        46,
        46,
        158,
        163,
        152,
        164,
        155,
        46,
        46,
        46,
        167,
        225,
        226,
        247,
        231,
        228,
        229,
        246,
        250,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        240,
        242,
        243,
        244,
        245,
        230,
        232,
        227,
        254,
        251,
        253,
        255,
        249,
        248,
        252,
        224,
        241,
        193,
        194,
        215,
        199,
        196,
        197,
        214,
        218,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        210,
        211,
        212,
        213,
        198,
        200,
        195,
        222,
        219,
        221,
        223,
        217,
        216,
        220,
        192,
        209,
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        184,
        186,
        32,
        179,
        191,
        32,
        32,
        32,
        32,
        32,
        180,
        162,
        32,
        32,
        32,
        32,
        168,
        170,
        32,
        178,
        175,
        32,
        32,
        32,
        32,
        32,
        165,
        161,
        169,
        254,
        224,
        225,
        246,
        228,
        229,
        244,
        227,
        245,
        232,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        255,
        240,
        241,
        242,
        243,
        230,
        226,
        252,
        251,
        231,
        248,
        253,
        249,
        247,
        250,
        222,
        192,
        193,
        214,
        196,
        197,
        212,
        195,
        213,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        223,
        208,
        209,
        210,
        211,
        198,
        194,
        220,
        219,
        199,
        216,
        221,
        217,
        215,
        218
    ];
    let _cyrCp866 = [
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        225,
        226,
        247,
        231,
        228,
        229,
        246,
        250,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        240,
        242,
        243,
        244,
        245,
        230,
        232,
        227,
        254,
        251,
        253,
        255,
        249,
        248,
        252,
        224,
        241,
        193,
        194,
        215,
        199,
        196,
        197,
        214,
        218,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        35,
        35,
        35,
        124,
        124,
        124,
        124,
        43,
        43,
        124,
        124,
        43,
        43,
        43,
        43,
        43,
        43,
        45,
        45,
        124,
        45,
        43,
        124,
        124,
        43,
        43,
        45,
        45,
        124,
        45,
        43,
        45,
        45,
        45,
        45,
        43,
        43,
        43,
        43,
        43,
        43,
        43,
        43,
        35,
        35,
        124,
        124,
        35,
        210,
        211,
        212,
        213,
        198,
        200,
        195,
        222,
        219,
        221,
        223,
        217,
        216,
        220,
        192,
        209,
        179,
        163,
        180,
        164,
        183,
        167,
        190,
        174,
        32,
        149,
        158,
        32,
        152,
        159,
        148,
        154,
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        205,
        186,
        213,
        241,
        243,
        201,
        32,
        245,
        187,
        212,
        211,
        200,
        190,
        32,
        247,
        198,
        199,
        204,
        181,
        240,
        242,
        185,
        32,
        244,
        203,
        207,
        208,
        202,
        216,
        32,
        246,
        32,
        238,
        160,
        161,
        230,
        164,
        165,
        228,
        163,
        229,
        168,
        169,
        170,
        171,
        172,
        173,
        174,
        175,
        239,
        224,
        225,
        226,
        227,
        166,
        162,
        236,
        235,
        167,
        232,
        237,
        233,
        231,
        234,
        158,
        128,
        129,
        150,
        132,
        133,
        148,
        131,
        149,
        136,
        137,
        138,
        139,
        140,
        141,
        142,
        143,
        159,
        144,
        145,
        146,
        147,
        134,
        130,
        156,
        155,
        135,
        152,
        157,
        153,
        151,
        154
    ];
    let _cyrIso88595 = [
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        179,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        225,
        226,
        247,
        231,
        228,
        229,
        246,
        250,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        240,
        242,
        243,
        244,
        245,
        230,
        232,
        227,
        254,
        251,
        253,
        255,
        249,
        248,
        252,
        224,
        241,
        193,
        194,
        215,
        199,
        196,
        197,
        214,
        218,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        210,
        211,
        212,
        213,
        198,
        200,
        195,
        222,
        219,
        221,
        223,
        217,
        216,
        220,
        192,
        209,
        32,
        163,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        241,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        161,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        32,
        238,
        208,
        209,
        230,
        212,
        213,
        228,
        211,
        229,
        216,
        217,
        218,
        219,
        220,
        221,
        222,
        223,
        239,
        224,
        225,
        226,
        227,
        214,
        210,
        236,
        235,
        215,
        232,
        237,
        233,
        231,
        234,
        206,
        176,
        177,
        198,
        180,
        181,
        196,
        179,
        197,
        184,
        185,
        186,
        187,
        188,
        189,
        190,
        191,
        207,
        192,
        193,
        194,
        195,
        182,
        178,
        204,
        203,
        183,
        200,
        205,
        201,
        199,
        202
    ];
    let _cyrMac = [
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        225,
        226,
        247,
        231,
        228,
        229,
        246,
        250,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        240,
        242,
        243,
        244,
        245,
        230,
        232,
        227,
        254,
        251,
        253,
        255,
        249,
        248,
        252,
        224,
        241,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        174,
        175,
        176,
        177,
        178,
        179,
        180,
        181,
        182,
        183,
        184,
        185,
        186,
        187,
        188,
        189,
        190,
        191,
        128,
        129,
        130,
        131,
        132,
        133,
        134,
        135,
        136,
        137,
        138,
        139,
        140,
        141,
        142,
        143,
        144,
        145,
        146,
        147,
        148,
        149,
        150,
        151,
        152,
        153,
        154,
        155,
        156,
        179,
        163,
        209,
        193,
        194,
        215,
        199,
        196,
        197,
        214,
        218,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        210,
        211,
        212,
        213,
        198,
        200,
        195,
        222,
        219,
        221,
        223,
        217,
        216,
        220,
        192,
        255,
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
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        91,
        92,
        93,
        94,
        95,
        96,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        192,
        193,
        194,
        195,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        210,
        211,
        212,
        213,
        214,
        215,
        216,
        217,
        218,
        219,
        220,
        221,
        222,
        223,
        160,
        161,
        162,
        222,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        174,
        175,
        176,
        177,
        178,
        221,
        180,
        181,
        182,
        183,
        184,
        185,
        186,
        187,
        188,
        189,
        190,
        191,
        254,
        224,
        225,
        246,
        228,
        229,
        244,
        227,
        245,
        232,
        233,
        234,
        235,
        236,
        237,
        238,
        239,
        223,
        240,
        241,
        242,
        243,
        230,
        226,
        252,
        251,
        231,
        248,
        253,
        249,
        247,
        250,
        158,
        128,
        129,
        150,
        132,
        133,
        148,
        131,
        149,
        136,
        137,
        138,
        139,
        140,
        141,
        142,
        143,
        159,
        144,
        145,
        146,
        147,
        134,
        130,
        156,
        155,
        135,
        152,
        157,
        153,
        151,
        154
    ];

    let fromTable = null;
    let toTable = null;
    let tmp;
    let i = 0;
    let retStr = '';

    switch (from.toUpperCase()) {
        case 'W':
            fromTable = _cyrWin1251;
            break;
        case 'A':
        case 'D':
            fromTable = _cyrCp866;
            break;
        case 'I':
            fromTable = _cyrIso88595;
            break;
        case 'M':
            fromTable = _cyrMac;
            break;
        case 'K':
            break;
        default:
            // Can we throw a warning instead? That would be more in line with PHP
            throw new Error('Unknown source charset: ' + fromTable);
    }

    switch (to.toUpperCase()) {
        case 'W':
            toTable = _cyrWin1251;
            break;
        case 'A':
        case 'D':
            toTable = _cyrCp866;
            break;
        case 'I':
            toTable = _cyrIso88595;
            break;
        case 'M':
            toTable = _cyrMac;
            break;
        case 'K':
            break;
        default:
            // Can we throw a warning instead? That would be more in line with PHP
            throw new Error('Unknown destination charset: ' + toTable);
    }

    if (!str) {
        return str;
    }

    for (i = 0; i < str.length; i++) {
        tmp = (fromTable === null)
            ? str.charAt(i)
            : String.fromCharCode(fromTable[str.charAt(i).charCodeAt(0)]);

        retStr += (toTable === null)
            ? tmp
            : String.fromCharCode(toTable[tmp.charCodeAt(0) + 256]);
    }

    return retStr;
}

/*
    ----- Split a string into smaller chunks -----
    //   example 1: chunk_split('Hello world!', 1, '*')
    //   returns 1: 'H*e*l*l*o* *w*o*r*l*d*!*'
    //   example 2: chunk_split('Hello world!', 10, '*')
    //   returns 2: 'Hello worl*d!*'
*/
__String.chunk_split = function (body, chunklen, end) {
    chunklen = parseInt(chunklen, 10) || 76;
    end = end || '\r\n';

    if (chunklen < 1) {
        return false;
    }

    return body.match(new RegExp('.{0,' + chunklen + '}', 'g'))
        .join(end);
}

/*
    ----- Generate a single-byte string from a number -----
    //   example 1: chr(75) === 'K'
    //   example 2: chr(65536) === '\uD800\uDC00'
    //   returns 1: true
    //   returns 2: true
*/
__String.chr = function (codePt) {
    if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
        //   enough for the UTF-16 encoding (JavaScript internal use), to
        //   require representation with two surrogates (reserved non-characters
        //   used for building other characters; the first is "high" and the next "low")
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    return String.fromCharCode(codePt);
}

/*
    ----- Strip whitespace (or other characters) from the end of a string -----
    //   example 1: rtrim('    Kevin van Zonneveld    ')
    //   returns 1: '    Kevin van Zonneveld'
*/
__String.rtrim = function (str, charlist) {
    charlist = !charlist
        ? ' \\s\u00A0'
        : (charlist + '')
            .replace(/([[\]().?/*{}+$^:])/g, '\\$1');

    let re = new RegExp('[' + charlist + ']+$', 'g');

    return (str + '').replace(re, '');
}

/*
    ----- Strip whitespace (or other characters) from the end of a string -----
    //   example 1: chop('    Kevin van Zonneveld    ')
    //   returns 1: '    Kevin van Zonneveld'
*/
__String.chop = function (str, charlist) {
    return this.rtrim(str, charlist);
}

/*
    ----- Convert binary data into hexadecimal representation -----
    //   example 1: bin2hex('Kev')
    //   returns 1: '4b6576'
    //   example 2: bin2hex(String.fromCharCode(0x00))
    //   returns 2: '00'
*/
__String.bin2hex = function (s) {
    let i;
    let l;
    let o = '';
    let n;

    s += '';

    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i)
            .toString(16);
        o += n.length < 2 ? '0' + n : n;
    }

    return o;
}

/*
    ----- Quote string with slashes -----
    //   example 1: addslashes("kevin's birthday")
    //   returns 1: "kevin\\'s birthday"
*/
__String.addslashes = function (str) {
    return (str + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\u0000/g, '\\0')
}

/*
    ----- Quote string with slashes in a C style -----
    //   example 1: addcslashes('foo[ ]', 'A..z'); // Escape all ASCII within capital A to lower z range, including square brackets
    //   returns 1: "\\f\\o\\o\\[ \\]"
    //   example 2: addcslashes("zoo['.']", 'z..A'); // Only escape z, period, and A here since not a lower-to-higher range
    //   returns 2: "\\zoo['\\.']"
    //   _example 3: addcslashes("@a\u0000\u0010\u00A9", "\0..\37!@\177..\377"); // Escape as octals those specified and less than 32 (0x20) or greater than 126 (0x7E), but not otherwise
    //   _returns 3: '\\@a\\000\\020\\302\\251'
    //   _example 4: addcslashes("\u0020\u007E", "\40..\175"); // Those between 32 (0x20 or 040) and 126 (0x7E or 0176) decimal value will be backslashed if specified (not octalized)
    //   _returns 4: '\\ ~'
    //   _example 5: addcslashes("\r\u0007\n", '\0..\37'); // Recognize C escape sequences if specified
    //   _returns 5: "\\r\\a\\n"
    //   _example 6: addcslashes("\r\u0007\n", '\0'); // Do not recognize C escape sequences if not specified
    //   _returns 6: "\r\u0007\n"
*/
__String.addcslashes = function (str, charlist) {
    let target = '';
    let chrs = [];
    let i = 0;
    let j = 0;
    let c = '';
    let next = '';
    let rangeBegin = '';
    let rangeEnd = '';
    let chr = '';
    let begin = 0;
    let end = 0;
    let octalLength = 0;
    let postOctalPos = 0;
    let cca = 0;
    let escHexGrp = [];
    let encoded = '';
    let percentHex = /%([\dA-Fa-f]+)/g;

    let _pad = function (n, c) {
        if ((n = n + '').length < c) {
            return new Array(++c - n.length).join('0') + n;
        }
        return n;
    };

    for (i = 0; i < charlist.length; i++) {
        c = charlist.charAt(i);
        next = charlist.charAt(i + 1);
        if (c === '\\' && next && (/\d/).test(next)) {
            // Octal
            rangeBegin = charlist.slice(i + 1).match(/^\d+/)[0];
            octalLength = rangeBegin.length;
            postOctalPos = i + octalLength + 1;
            if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') {
                // Octal begins range
                begin = rangeBegin.charCodeAt(0);
                if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) {
                    // Range ends with octal
                    rangeEnd = charlist.slice(postOctalPos + 3).match(/^\d+/)[0];
                    // Skip range end backslash
                    i += 1;
                } else if (charlist.charAt(postOctalPos + 2)) {
                    // Range ends with character
                    rangeEnd = charlist.charAt(postOctalPos + 2);
                } else {
                    throw new Error('Range with no end point');
                }
                end = rangeEnd.charCodeAt(0);
                if (end > begin) {
                    // Treat as a range
                    for (j = begin; j <= end; j++) {
                        chrs.push(String.fromCharCode(j));
                    }
                } else {
                    // Supposed to treat period, begin and end as individual characters only, not a range
                    chrs.push('.', rangeBegin, rangeEnd);
                }
                // Skip dots and range end (already skipped range end backslash if present)
                i += rangeEnd.length + 2;
            } else {
                // Octal is by itself
                chr = String.fromCharCode(parseInt(rangeBegin, 8));
                chrs.push(chr);
            }
            // Skip range begin
            i += octalLength;
        } else if (next + charlist.charAt(i + 2) === '..') {
            // Character begins range
            rangeBegin = c;
            begin = rangeBegin.charCodeAt(0);
            if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) {
                // Range ends with octal
                rangeEnd = charlist.slice(i + 4).match(/^\d+/)[0];
                // Skip range end backslash
                i += 1;
            } else if (charlist.charAt(i + 3)) {
                // Range ends with character
                rangeEnd = charlist.charAt(i + 3);
            } else {
                throw new Error('Range with no end point');
            }
            end = rangeEnd.charCodeAt(0);
            if (end > begin) {
                // Treat as a range
                for (j = begin; j <= end; j++) {
                    chrs.push(String.fromCharCode(j));
                }
            } else {
                // Supposed to treat period, begin and end as individual characters only, not a range
                chrs.push('.', rangeBegin, rangeEnd);
            }
            // Skip dots and range end (already skipped range end backslash if present)
            i += rangeEnd.length + 2;
        } else {
            // Character is by itself
            chrs.push(c);
        }
    }

    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);
        if (chrs.indexOf(c) !== -1) {
            target += '\\';
            cca = c.charCodeAt(0);
            if (cca < 32 || cca > 126) {
                // Needs special escaping
                switch (c) {
                    case '\n':
                        target += 'n';
                        break;
                    case '\t':
                        target += 't';
                        break;
                    case '\u000D':
                        target += 'r';
                        break;
                    case '\u0007':
                        target += 'a';
                        break;
                    case '\v':
                        target += 'v';
                        break;
                    case '\b':
                        target += 'b';
                        break;
                    case '\f':
                        target += 'f';
                        break;
                    default:
                        // target += _pad(cca.toString(8), 3);break; // Sufficient for UTF-16
                        encoded = encodeURIComponent(c);

                        // 3-length-padded UTF-8 octets
                        if ((escHexGrp = percentHex.exec(encoded)) !== null) {
                            // already added a slash above:
                            target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                        }
                        while ((escHexGrp = percentHex.exec(encoded)) !== null) {
                            target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                        }
                        break;
                }
            } else {
                // Perform regular backslashed escaping
                target += c;
            }
        } else {
            // Just add the character unescaped
            target += c;
        }
    }

    return target;
}

/*
    ----- Title -----
    //        example 1: strnatcasecmp(10, 1)
    //        returns 1: 1
    //        example 2: strnatcasecmp('1', '10')
    //        returns 2: -1
*/ 
__String.strnatcasecmp = function (a, b) {
    if (arguments.length !== 2) {
        return null
    }

    return this.strnatcmp(__Helpers._phpCastString(a).toLowerCase(), __Helpers._phpCastString(b).toLowerCase())
}

/*
    ----- Title -----
    //   example 1: echo('Hello world')
    //   returns 1: undefined
*/
__String.echo = function (param) {
    let args = Array.prototype.slice.call(arguments);
    return console.log(args.join(' '));
}

/*
    ----- Title -----
    //        example 1: strnatcmp('abc', 'abc')
    //        returns 1: 0
    //        example 2: strnatcmp('a', 'b')
    //        returns 2: -1
    //        example 3: strnatcmp('10', '1')
    //        returns 3: 1
    //        example 4: strnatcmp('0000abc', '0abc')
    //        returns 4: 0
    //        example 5: strnatcmp('1239', '12345')
    //        returns 5: -1
    //        example 6: strnatcmp('t01239', 't012345')
    //        returns 6: 1
    //        example 7: strnatcmp('0A', '5N')
    //        returns 7: -1
*/
__String.strnatcmp = function (a, b) {
    let leadingZeros = /^0+(?=\d)/;
    let whitespace = /^\s/;
    let digit = /^\d/;

    if (arguments.length !== 2) {
        return null;
    }

    a = __Helpers._phpCastString(a);
    b = __Helpers._phpCastString(b);

    if (!a.length || !b.length) {
        return a.length - b.length;
    }

    let i = 0;
    let j = 0;

    a = a.replace(leadingZeros, '');
    b = b.replace(leadingZeros, '');

    while (i < a.length && j < b.length) {
        // skip consecutive whitespace
        while (whitespace.test(a.charAt(i))) i++;
        while (whitespace.test(b.charAt(j))) j++;

        let ac = a.charAt(i);
        let bc = b.charAt(j);
        let aIsDigit = digit.test(ac);
        let bIsDigit = digit.test(bc);

        if (aIsDigit && bIsDigit) {
            let bias = 0;
            let fractional = ac === '0' || bc === '0';

            do {
                if (!aIsDigit) {
                    return -1;
                } else if (!bIsDigit) {
                    return 1;
                } else if (ac < bc) {
                    if (!bias) {
                        bias = -1;
                    }

                    if (fractional) {
                        return -1;
                    }
                } else if (ac > bc) {
                    if (!bias) {
                        bias = 1;
                    }

                    if (fractional) {
                        return 1;
                    }
                }

                ac = a.charAt(++i);
                bc = b.charAt(++j);

                aIsDigit = digit.test(ac);
                bIsDigit = digit.test(bc);
            } while (aIsDigit || bIsDigit)

            if (!fractional && bias) {
                return bias;
            }

            continue;
        }

        if (!ac || !bc) {
            continue;
        } else if (ac < bc) {
            return -1;
        } else if (ac > bc) {
            return 1;
        }

        i++;
        j++;
    }

    let iBeforeStrEnd = i < a.length;
    let jBeforeStrEnd = j < b.length;

    // Check which string ended first
    // return -1 if a, 1 if b, 0 otherwise
    return (iBeforeStrEnd > jBeforeStrEnd) - (iBeforeStrEnd < jBeforeStrEnd);
}

/* -------------------------------------------------------- END STRING -------------------------------------------------------- */



__._string = __String;



/* -------------------------------------------------------- HELPERS -------------------------------------------------------- */
var __Helpers = {};


/*
    ----- Title -----
    //   example 1: _php_cast_int(false)
    //   returns 1: 0
    //   example 2: _php_cast_int(true)
    //   returns 2: 1
    //   example 3: _php_cast_int(0)
    //   returns 3: 0
    //   example 4: _php_cast_int(1)
    //   returns 4: 1
    //   example 5: _php_cast_int(3.14)
    //   returns 5: 3
    //   example 6: _php_cast_int('')
    //   returns 6: 0
    //   example 7: _php_cast_int('0')
    //   returns 7: 0
    //   example 8: _php_cast_int('abc')
    //   returns 8: 0
    //   example 9: _php_cast_int(null)
    //   returns 9: 0
    //  example 10: _php_cast_int(undefined)
    //  returns 10: 0
    //  example 11: _php_cast_int('123abc')
    //  returns 11: 123
    //  example 12: _php_cast_int('123e4')
    //  returns 12: 123
    //  example 13: _php_cast_int(0x200000001)
    //  returns 13: 8589934593
*/
__Helpers._php_cast_int = function (value) {
    let type = typeof value;

    switch (type) {
        case 'number':
            if (isNaN(value) || !isFinite(value)) {
                // from PHP 7, NaN and Infinity are casted to 0
                return 0;
            }

            return value < 0 ? Math.ceil(value) : Math.floor(value);
        case 'string':
            return parseInt(value, 10) || 0;
        case 'boolean':
        // fall through
        default:
            // Behaviour for types other than float, string, boolean
            // is undefined and can change any time.
            // To not invent complex logic
            // that mimics PHP 7.0 behaviour
            // casting value->bool->number is used
            return +!!value;
    }
}

/*
    ----- Title -----
    //   example 1: let $bc = _bc()
    //   example 1: let $result = $bc.PLUS
    //   returns 1: '+'
*/
__Helpers._bc = function (param) {
    let Libbcmath = {
        PLUS: '+',
        MINUS: '-',
        BASE: 10,
        // must be 10 (for now)
        scale: 0,
        // default scale
        /**
         * Basic number structure
         */
        bc_num: function () {
            this.n_sign = null; // sign
            this.n_len = null; // (int) The number of digits before the decimal point.
            this.n_scale = null; // (int) The number of digits after the decimal point.
            this.n_value = null; // array as value, where 1.23 = [1,2,3]
            this.toString = function () {
                let r, tmp;
                tmp = this.n_value.join('');

                // add minus sign (if applicable) then add the integer part
                r = ((this.n_sign === Libbcmath.PLUS) ? '' : this.n_sign) + tmp.substr(0, this.n_len);

                // if decimal places, add a . and the decimal part
                if (this.n_scale > 0) {
                    r += '.' + tmp.substr(this.n_len, this.n_scale);
                }
                return r;
            }
        },

        /**
         * Base add function
         *
         //  Here is the full add routine that takes care of negative numbers.
         //  N1 is added to N2 and the result placed into RESULT.  SCALE_MIN
         //  is the minimum scale for the result.
         *
         * @param {bc_num} n1
         * @param {bc_num} n2
         * @param {int} scaleMin
         * @return bc_num
         */
        bc_add: function (n1, n2, scaleMin) {
            let sum, cmpRes, resScale;

            if (n1.n_sign === n2.n_sign) {
                sum = Libbcmath._bc_do_add(n1, n2, scaleMin);
                sum.n_sign = n1.n_sign;
            } else { // subtraction must be done.
                cmpRes = Libbcmath._bc_do_compare(n1, n2, false, false); // Compare magnitudes.
                switch (cmpRes) {
                    case -1:
                        // n1 is less than n2, subtract n1 from n2.
                        sum = Libbcmath._bc_do_sub(n2, n1, scaleMin);
                        sum.n_sign = n2.n_sign;
                        break;

                    case 0:
                        // They are equal! return zero with the correct scale!
                        resScale = Libbcmath.MAX(scaleMin, Libbcmath.MAX(n1.n_scale, n2.n_scale));
                        sum = Libbcmath.bc_new_num(1, resScale);
                        Libbcmath.memset(sum.n_value, 0, 0, resScale + 1);
                        break;

                    case 1:
                        // n2 is less than n1, subtract n2 from n1.
                        sum = Libbcmath._bc_do_sub(n1, n2, scaleMin);
                        sum.n_sign = n1.n_sign;
                }
            }
            return sum;
        },

        /**
         * This is the "user callable" routine to compare numbers N1 and N2.
         * @param {bc_num} n1
         * @param {bc_num} n2
         * @return int -1, 0, 1  (n1 < n2, ===, n1 > n2)
         */
        bc_compare: function (n1, n2) {
            return Libbcmath._bc_do_compare(n1, n2, true, false);
        },

        _one_mult: function (num, nPtr, size, digit, result, rPtr) {
            let carry, value; // int
            let nptr, rptr; // int pointers
            if (digit === 0) {
                Libbcmath.memset(result, 0, 0, size); // memset (result, 0, size);
            } else {
                if (digit === 1) {
                    Libbcmath.memcpy(result, rPtr, num, nPtr, size); // memcpy (result, num, size);
                } else { // Initialize
                    nptr = nPtr + size - 1; // nptr = (unsigned char *) (num+size-1);
                    rptr = rPtr + size - 1; // rptr = (unsigned char *) (result+size-1);
                    carry = 0;

                    while (size-- > 0) {
                        value = num[nptr--] * digit + carry; // value = *nptr-- * digit + carry;
                        result[rptr--] = value % Libbcmath.BASE; // @CHECK cint //*rptr-- = value % BASE;
                        carry = Math.floor(value / Libbcmath.BASE); // @CHECK cint //carry = value / BASE;
                    }

                    if (carry !== 0) {
                        result[rptr] = carry;
                    }
                }
            }
        },

        bc_divide: function (n1, n2, scale) {
            // let quot // bc_num return
            let qval; // bc_num
            let num1, num2; // string
            let ptr1, ptr2, n2ptr, qptr; // int pointers
            let scale1, val; // int
            let len1, len2, scale2, qdigits, extra, count; // int
            let qdig, qguess, borrow, carry; // int
            let mval; // string
            let zero; // char
            let norm; // int
            // let ptrs // return object from one_mul
            // Test for divide by zero. (return failure)
            if (Libbcmath.bc_is_zero(n2)) {
                return -1;
            }

            // Test for zero divide by anything (return zero)
            if (Libbcmath.bc_is_zero(n1)) {
                return Libbcmath.bc_new_num(1, scale);
            }

            // Test for divide by 1.  If it is we must truncate.
            // @todo: check where scale > 0 too.. can't see why not
            // (ie bc_is_zero - add bc_is_one function)
            if (n2.n_scale === 0) {
                if (n2.n_len === 1 && n2.n_value[0] === 1) {
                    qval = Libbcmath.bc_new_num(n1.n_len, scale);
                    qval.n_sign = (n1.n_sign === n2.n_sign ? Libbcmath.PLUS : Libbcmath.MINUS);
                    // memset (&qval->n_value[n1->n_len],0,scale):
                    Libbcmath.memset(qval.n_value, n1.n_len, 0, scale);
                    // memcpy (qval->n_value, n1->n_value, n1->n_len + MIN(n1->n_scale,scale)):
                    Libbcmath.memcpy(
                        qval.n_value,
                        0,
                        n1.n_value,
                        0,
                        n1.n_len + Libbcmath.MIN(n1.n_scale, scale)
                    );
                }
            }

            /* Set up the divide.  Move the decimal point on n1 by n2's scale.
             Remember, zeros on the end of num2 are wasted effort for dividing. */
            scale2 = n2.n_scale;
            n2ptr = n2.n_len + scale2 - 1;
            while ((scale2 > 0) && (n2.n_value[n2ptr--] === 0)) {
                scale2--;
            }

            len1 = n1.n_len + scale2;
            scale1 = n1.n_scale - scale2;
            if (scale1 < scale) {
                extra = scale - scale1;
            } else {
                extra = 0;
            }

            num1 = Libbcmath.safe_emalloc(1, n1.n_len + n1.n_scale, extra + 2);
            if (num1 === null) {
                Libbcmath.bc_out_of_memory();
            }
            Libbcmath.memset(num1, 0, 0, n1.n_len + n1.n_scale + extra + 2);
            Libbcmath.memcpy(num1, 1, n1.n_value, 0, n1.n_len + n1.n_scale);
            len2 = n2.n_len + scale2;
            num2 = Libbcmath.safe_emalloc(1, len2, 1);
            if (num2 === null) {
                Libbcmath.bc_out_of_memory();
            }
            Libbcmath.memcpy(num2, 0, n2.n_value, 0, len2);
            num2[len2] = 0;
            n2ptr = 0;
            while (num2[n2ptr] === 0) {
                n2ptr++;
                len2--;
            }

            // Calculate the number of quotient digits.
            if (len2 > len1 + scale) {
                qdigits = scale + 1;
                zero = true;
            } else {
                zero = false;
                if (len2 > len1) {
                    qdigits = scale + 1; // One for the zero integer part.
                } else {
                    qdigits = len1 - len2 + scale + 1;
                }
            }

            // Allocate and zero the storage for the quotient.
            qval = Libbcmath.bc_new_num(qdigits - scale, scale);
            // memset (qval->n_value, 0, qdigits);
            Libbcmath.memset(qval.n_value, 0, 0, qdigits);
            // Allocate storage for the temporary storage mval.
            mval = Libbcmath.safe_emalloc(1, len2, 1);
            if (mval === null) {
                Libbcmath.bc_out_of_memory();
            }

            // Now for the full divide algorithm.
            if (!zero) { // Normalize
                norm = Math.floor(10 / (n2.n_value[n2ptr] + 1));
                if (norm !== 1) {

                    Libbcmath._one_mult(num1, 0, len1 + scale1 + extra + 1, norm, num1, 0);

                    Libbcmath._one_mult(n2.n_value, n2ptr, len2, norm, n2.n_value, n2ptr);
                    // @todo: Check: Is the pointer affected by the call? if so,
                    // maybe need to adjust points on return?
                }

                // Initialize divide loop.
                qdig = 0;
                if (len2 > len1) {
                    qptr = len2 - len1;
                } else {
                    qptr = 0;
                }

                // Loop
                while (qdig <= len1 + scale - len2) { // Calculate the quotient digit guess.
                    if (n2.n_value[n2ptr] === num1[qdig]) {
                        qguess = 9;
                    } else {
                        qguess = Math.floor((num1[qdig] * 10 + num1[qdig + 1]) / n2.n_value[n2ptr]);
                    }
                    // Test qguess.

                    if (n2.n_value[n2ptr + 1] * qguess >
                        (num1[qdig] * 10 + num1[qdig + 1] - n2.n_value[n2ptr] * qguess) *
                        10 + num1[qdig + 2]) {
                        qguess--;
                        // And again.
                        if (n2.n_value[n2ptr + 1] * qguess >
                            (num1[qdig] * 10 + num1[qdig + 1] - n2.n_value[n2ptr] * qguess) *
                            10 + num1[qdig + 2]) {
                            qguess--;
                        }
                    }

                    // Multiply and subtract.
                    borrow = 0;
                    if (qguess !== 0) {
                        mval[0] = 0;// @CHECK is this to fix ptr2 < 0?

                        Libbcmath._one_mult(n2.n_value, n2ptr, len2, qguess, mval, 1);
                        ptr1 = qdig + len2;
                        ptr2 = len2;
                        // @todo: CHECK: Does a negative pointer return null?
                        // ptr2 can be < 0 here as ptr1 = len2, thus count < len2+1 will always fail ?
                        for (count = 0; count < len2 + 1; count++) {
                            if (ptr2 < 0) {
                                val = num1[ptr1] - 0 - borrow;
                            } else {
                                val = num1[ptr1] - mval[ptr2--] - borrow;
                            }
                            if (val < 0) {
                                val += 10;
                                borrow = 1;
                            } else {
                                borrow = 0;
                            }
                            num1[ptr1--] = val;
                        }
                    }

                    // Test for negative result.
                    if (borrow === 1) {
                        qguess--;
                        ptr1 = qdig + len2;
                        ptr2 = len2 - 1;
                        carry = 0;
                        for (count = 0; count < len2; count++) {
                            if (ptr2 < 0) {
                                val = num1[ptr1] + 0 + carry;
                            } else {
                                val = num1[ptr1] + n2.n_value[ptr2--] + carry;
                            }
                            if (val > 9) {
                                val -= 10;
                                carry = 1;
                            } else {
                                carry = 0;
                            }
                            num1[ptr1--] = val;
                        }
                        if (carry === 1) {
                            num1[ptr1] = (num1[ptr1] + 1) % 10;
                        }
                    }

                    // We now know the quotient digit.
                    qval.n_value[qptr++] = qguess;
                    qdig++;
                }
            }

            // Clean up and return the number.
            qval.n_sign = (n1.n_sign === n2.n_sign ? Libbcmath.PLUS : Libbcmath.MINUS);
            if (Libbcmath.bc_is_zero(qval)) {
                qval.n_sign = Libbcmath.PLUS;
            }
            Libbcmath._bc_rm_leading_zeros(qval);

            return qval;
        },

        MUL_BASE_DIGITS: 80,
        MUL_SMALL_DIGITS: (80 / 4),
        // #define MUL_SMALL_DIGITS mul_base_digits/4

        /* The multiply routine.  N2 times N1 is put int PROD with the scale of
       the result being MIN(N2 scale+N1 scale, MAX (SCALE, N2 scale, N1 scale)).
       */
        /**
         * @param n1 bc_num
         * @param n2 bc_num
         * @param scale [int] optional
         */
        bc_multiply: function (n1, n2, scale) {
            let pval; // bc_num
            let len1, len2; // int
            let fullScale, prodScale; // int
            // Initialize things.
            len1 = n1.n_len + n1.n_scale;
            len2 = n2.n_len + n2.n_scale;
            fullScale = n1.n_scale + n2.n_scale;
            prodScale = Libbcmath.MIN(
                fullScale,
                Libbcmath.MAX(scale, Libbcmath.MAX(n1.n_scale, n2.n_scale))
            );

            // Do the multiply
            pval = Libbcmath._bc_rec_mul(n1, len1, n2, len2, fullScale);

            // Assign to prod and clean up the number.
            pval.n_sign = (n1.n_sign === n2.n_sign ? Libbcmath.PLUS : Libbcmath.MINUS);

            pval.n_len = len2 + len1 + 1 - fullScale;
            pval.n_scale = prodScale;
            Libbcmath._bc_rm_leading_zeros(pval);
            if (Libbcmath.bc_is_zero(pval)) {
                pval.n_sign = Libbcmath.PLUS;
            }
            return pval;
        },

        new_sub_num: function (length, scale, value, ptr = 0) {
            let temp = new Libbcmath.bc_num(); // eslint-disable-line new-cap
            temp.n_sign = Libbcmath.PLUS;
            temp.n_len = length;
            temp.n_scale = scale;
            temp.n_value = Libbcmath.safe_emalloc(1, length + scale, 0);
            Libbcmath.memcpy(temp.n_value, 0, value, ptr, length + scale);
            return temp;
        },

        _bc_simp_mul: function (n1, n1len, n2, n2len, fullScale) {
            let prod; // bc_num
            let n1ptr, n2ptr, pvptr; // char *n1ptr, *n2ptr, *pvptr;
            let n1end, n2end; // char *n1end, *n2end;        // To the end of n1 and n2.
            let indx, sum, prodlen; // int indx, sum, prodlen;
            prodlen = n1len + n2len + 1;

            prod = Libbcmath.bc_new_num(prodlen, 0);

            n1end = n1len - 1; // (char *) (n1->n_value + n1len - 1);
            n2end = n2len - 1; // (char *) (n2->n_value + n2len - 1);
            pvptr = prodlen - 1; // (char *) ((*prod)->n_value + prodlen - 1);
            sum = 0;

            // Here is the loop...
            for (indx = 0; indx < prodlen - 1; indx++) {
                // (char *) (n1end - MAX(0, indx-n2len+1));
                n1ptr = n1end - Libbcmath.MAX(0, indx - n2len + 1);
                // (char *) (n2end - MIN(indx, n2len-1));
                n2ptr = n2end - Libbcmath.MIN(indx, n2len - 1);
                while ((n1ptr >= 0) && (n2ptr <= n2end)) {
                    // sum += *n1ptr-- * *n2ptr++;
                    sum += n1.n_value[n1ptr--] * n2.n_value[n2ptr++];
                }
                //* pvptr-- = sum % BASE;
                prod.n_value[pvptr--] = Math.floor(sum % Libbcmath.BASE);
                sum = Math.floor(sum / Libbcmath.BASE); // sum = sum / BASE;
            }
            prod.n_value[pvptr] = sum; //* pvptr = sum;
            return prod;
        },

        /* A special adder/subtractor for the recursive divide and conquer
           multiply algorithm.  Note: if sub is called, accum must
           be larger that what is being subtracted.  Also, accum and val
           must have n_scale = 0.  (e.g. they must look like integers. *) */
        _bc_shift_addsub: function (accum, val, shift, sub) {
            let accp, valp; // signed char *accp, *valp;
            let count, carry; // int  count, carry;
            count = val.n_len;
            if (val.n_value[0] === 0) {
                count--;
            }

            // assert (accum->n_len+accum->n_scale >= shift+count);
            if (accum.n_len + accum.n_scale < shift + count) {
                throw new Error('len + scale < shift + count'); // ?? I think that's what assert does :)
            }

            // Set up pointers and others
            // (signed char *)(accum->n_value + accum->n_len + accum->n_scale - shift - 1);
            accp = accum.n_len + accum.n_scale - shift - 1;
            valp = val.n_len - 1; // (signed char *)(val->n_value + val->n_len - 1);
            carry = 0;
            if (sub) {
                // Subtraction, carry is really borrow.
                while (count--) {
                    accum.n_value[accp] -= val.n_value[valp--] + carry; //* accp -= *valp-- + carry;
                    if (accum.n_value[accp] < 0) { // if (*accp < 0)
                        carry = 1;
                        accum.n_value[accp--] += Libbcmath.BASE; //* accp-- += BASE;
                    } else {
                        carry = 0;
                        accp--;
                    }
                }
                while (carry) {
                    accum.n_value[accp] -= carry; //* accp -= carry;
                    if (accum.n_value[accp] < 0) { // if (*accp < 0)
                        accum.n_value[accp--] += Libbcmath.BASE; //    *accp-- += BASE;
                    } else {
                        carry = 0;
                    }
                }
            } else {
                // Addition
                while (count--) {
                    accum.n_value[accp] += val.n_value[valp--] + carry; //* accp += *valp-- + carry;
                    if (accum.n_value[accp] > (Libbcmath.BASE - 1)) { // if (*accp > (BASE-1))
                        carry = 1;
                        accum.n_value[accp--] -= Libbcmath.BASE; //* accp-- -= BASE;
                    } else {
                        carry = 0;
                        accp--;
                    }
                }
                while (carry) {
                    accum.n_value[accp] += carry; //* accp += carry;
                    if (accum.n_value[accp] > (Libbcmath.BASE - 1)) { // if (*accp > (BASE-1))
                        accum.n_value[accp--] -= Libbcmath.BASE; //* accp-- -= BASE;
                    } else {
                        carry = 0;
                    }
                }
            }
            return true // accum is the pass-by-reference return
        },

        /* Recursive divide and conquer multiply algorithm.
           based on
           Let u = u0 + u1*(b^n)
           Let v = v0 + v1*(b^n)
           Then uv = (B^2n+B^n)*u1*v1 + B^n*(u1-u0)*(v0-v1) + (B^n+1)*u0*v0
           B is the base of storage, number of digits in u1,u0 close to equal.
        */
        _bc_rec_mul: function (u, ulen, v, vlen, fullScale) {
            let prod; // @return
            let u0, u1, v0, v1; // bc_num
            // let u0len,
            // let v0len // int
            let m1, m2, m3, d1, d2; // bc_num
            let n, prodlen, m1zero; // int
            let d1len, d2len; // int
            // Base case?
            if ((ulen + vlen) < Libbcmath.MUL_BASE_DIGITS ||
                ulen < Libbcmath.MUL_SMALL_DIGITS ||
                vlen < Libbcmath.MUL_SMALL_DIGITS) {
                return Libbcmath._bc_simp_mul(u, ulen, v, vlen, fullScale);
            }

            // Calculate n -- the u and v split point in digits.
            n = Math.floor((Libbcmath.MAX(ulen, vlen) + 1) / 2);

            // Split u and v.
            if (ulen < n) {
                u1 = Libbcmath.bc_init_num(); // u1 = bc_copy_num (BCG(_zero_));
                u0 = Libbcmath.new_sub_num(ulen, 0, u.n_value);
            } else {
                u1 = Libbcmath.new_sub_num(ulen - n, 0, u.n_value);
                u0 = Libbcmath.new_sub_num(n, 0, u.n_value, ulen - n);
            }
            if (vlen < n) {
                v1 = Libbcmath.bc_init_num(); // bc_copy_num (BCG(_zero_));
                v0 = Libbcmath.new_sub_num(vlen, 0, v.n_value);
            } else {
                v1 = Libbcmath.new_sub_num(vlen - n, 0, v.n_value);
                v0 = Libbcmath.new_sub_num(n, 0, v.n_value, vlen - n);
            }
            Libbcmath._bc_rm_leading_zeros(u1);
            Libbcmath._bc_rm_leading_zeros(u0);
            // let u0len = u0.n_len
            Libbcmath._bc_rm_leading_zeros(v1);
            Libbcmath._bc_rm_leading_zeros(v0);
            // let v0len = v0.n_len

            m1zero = Libbcmath.bc_is_zero(u1) || Libbcmath.bc_is_zero(v1);

            // Calculate sub results ...
            d1 = Libbcmath.bc_init_num(); // needed?
            d2 = Libbcmath.bc_init_num(); // needed?
            d1 = Libbcmath.bc_sub(u1, u0, 0);
            d1len = d1.n_len;

            d2 = Libbcmath.bc_sub(v0, v1, 0);
            d2len = d2.n_len;

            // Do recursive multiplies and shifted adds.
            if (m1zero) {
                m1 = Libbcmath.bc_init_num(); // bc_copy_num (BCG(_zero_));
            } else {
                //allow pass-by-ref
                m1 = Libbcmath._bc_rec_mul(u1, u1.n_len, v1, v1.n_len, 0);
            }
            if (Libbcmath.bc_is_zero(d1) || Libbcmath.bc_is_zero(d2)) {
                m2 = Libbcmath.bc_init_num(); // bc_copy_num (BCG(_zero_));
            } else {
                //allow pass-by-ref
                m2 = Libbcmath._bc_rec_mul(d1, d1len, d2, d2len, 0);
            }

            if (Libbcmath.bc_is_zero(u0) || Libbcmath.bc_is_zero(v0)) {
                m3 = Libbcmath.bc_init_num(); // bc_copy_num (BCG(_zero_));
            } else {
                //allow pass-by-ref
                m3 = Libbcmath._bc_rec_mul(u0, u0.n_len, v0, v0.n_len, 0);
            }

            // Initialize product
            prodlen = ulen + vlen + 1;
            prod = Libbcmath.bc_new_num(prodlen, 0);

            if (!m1zero) {
                Libbcmath._bc_shift_addsub(prod, m1, 2 * n, 0);
                Libbcmath._bc_shift_addsub(prod, m1, n, 0);
            }
            Libbcmath._bc_shift_addsub(prod, m3, n, 0);
            Libbcmath._bc_shift_addsub(prod, m3, 0, 0);
            Libbcmath._bc_shift_addsub(prod, m2, n, d1.n_sign !== d2.n_sign);

            return prod;
        },

        /**
         *
         * @param {bc_num} n1
         * @param {bc_num} n2
         * @param {boolean} useSign
         * @param {boolean} ignoreLast
         * @return -1, 0, 1 (see bc_compare)
         */
        _bc_do_compare: function (n1, n2, useSign, ignoreLast) {
            let n1ptr, n2ptr; // int
            let count; // int
            // First, compare signs.
            if (useSign && (n1.n_sign !== n2.n_sign)) {
                if (n1.n_sign === Libbcmath.PLUS) {
                    return (1); // Positive N1 > Negative N2
                } else {
                    return (-1); // Negative N1 < Positive N1
                }
            }

            // Now compare the magnitude.
            if (n1.n_len !== n2.n_len) {
                if (n1.n_len > n2.n_len) { // Magnitude of n1 > n2.
                    if (!useSign || (n1.n_sign === Libbcmath.PLUS)) {
                        return (1);
                    } else {
                        return (-1);
                    }
                } else { // Magnitude of n1 < n2.
                    if (!useSign || (n1.n_sign === Libbcmath.PLUS)) {
                        return (-1);
                    } else {
                        return (1);
                    }
                }
            }

            /* If we get here, they have the same number of integer digits.
           check the integer part and the equal length part of the fraction. */
            count = n1.n_len + Math.min(n1.n_scale, n2.n_scale);
            n1ptr = 0;
            n2ptr = 0;

            while ((count > 0) && (n1.n_value[n1ptr] === n2.n_value[n2ptr])) {
                n1ptr++;
                n2ptr++;
                count--;
            }

            if (ignoreLast && (count === 1) && (n1.n_scale === n2.n_scale)) {
                return (0);
            }

            if (count !== 0) {
                if (n1.n_value[n1ptr] > n2.n_value[n2ptr]) { // Magnitude of n1 > n2.
                    if (!useSign || n1.n_sign === Libbcmath.PLUS) {
                        return (1);
                    } else {
                        return (-1);
                    }
                } else { // Magnitude of n1 < n2.
                    if (!useSign || n1.n_sign === Libbcmath.PLUS) {
                        return (-1);
                    } else {
                        return (1);
                    }
                }
            }

            // They are equal up to the last part of the equal part of the fraction.
            if (n1.n_scale !== n2.n_scale) {
                if (n1.n_scale > n2.n_scale) {
                    for (count = (n1.n_scale - n2.n_scale); count > 0; count--) {
                        if (n1.n_value[n1ptr++] !== 0) { // Magnitude of n1 > n2.
                            if (!useSign || n1.n_sign === Libbcmath.PLUS) {
                                return (1);
                            } else {
                                return (-1);
                            }
                        }
                    }
                } else {
                    for (count = (n2.n_scale - n1.n_scale); count > 0; count--) {
                        if (n2.n_value[n2ptr++] !== 0) { // Magnitude of n1 < n2.
                            if (!useSign || n1.n_sign === Libbcmath.PLUS) {
                                return (-1);
                            } else {
                                return (1);
                            }
                        }
                    }
                }
            }

            // They must be equal!
            return (0);
        },

        /* Here is the full subtract routine that takes care of negative numbers.
       N2 is subtracted from N1 and the result placed in RESULT.  SCALE_MIN
       is the minimum scale for the result. */
        bc_sub: function (n1, n2, scaleMin) {
            let diff; // bc_num
            let cmpRes, resScale; // int
            if (n1.n_sign !== n2.n_sign) {
                diff = Libbcmath._bc_do_add(n1, n2, scaleMin);
                diff.n_sign = n1.n_sign;
            } else { // subtraction must be done.
                // Compare magnitudes.
                cmpRes = Libbcmath._bc_do_compare(n1, n2, false, false);
                switch (cmpRes) {
                    case -1:
                        // n1 is less than n2, subtract n1 from n2.
                        diff = Libbcmath._bc_do_sub(n2, n1, scaleMin);
                        diff.n_sign = (n2.n_sign === Libbcmath.PLUS ? Libbcmath.MINUS : Libbcmath.PLUS);
                        break;
                    case 0:
                        // They are equal! return zero!
                        resScale = Libbcmath.MAX(scaleMin, Libbcmath.MAX(n1.n_scale, n2.n_scale));
                        diff = Libbcmath.bc_new_num(1, resScale);
                        Libbcmath.memset(diff.n_value, 0, 0, resScale + 1);
                        break;
                    case 1:
                        // n2 is less than n1, subtract n2 from n1.
                        diff = Libbcmath._bc_do_sub(n1, n2, scaleMin);
                        diff.n_sign = n1.n_sign;
                        break;
                }
            }

            // Clean up and return.
            return diff;
        },

        _bc_do_add: function (n1, n2, scaleMin) {
            let sum; // bc_num
            let sumScale, sumDigits; // int
            let n1ptr, n2ptr, sumptr; // int
            let carry, n1bytes, n2bytes; // int
            let tmp; // int

            // Prepare sum.
            sumScale = Libbcmath.MAX(n1.n_scale, n2.n_scale);
            sumDigits = Libbcmath.MAX(n1.n_len, n2.n_len) + 1;
            sum = Libbcmath.bc_new_num(sumDigits, Libbcmath.MAX(sumScale, scaleMin));

            // Start with the fraction part.  Initialize the pointers.
            n1bytes = n1.n_scale;
            n2bytes = n2.n_scale;
            n1ptr = (n1.n_len + n1bytes - 1);
            n2ptr = (n2.n_len + n2bytes - 1);
            sumptr = (sumScale + sumDigits - 1);

            // Add the fraction part.  First copy the longer fraction
            // (ie when adding 1.2345 to 1 we know .2345 is correct already) .
            if (n1bytes !== n2bytes) {
                if (n1bytes > n2bytes) {
                    // n1 has more dp then n2
                    while (n1bytes > n2bytes) {
                        sum.n_value[sumptr--] = n1.n_value[n1ptr--];
                        n1bytes--;
                    }
                } else {
                    // n2 has more dp then n1
                    while (n2bytes > n1bytes) {
                        sum.n_value[sumptr--] = n2.n_value[n2ptr--];
                        n2bytes--;
                    }
                }
            }

            // Now add the remaining fraction part and equal size integer parts.
            n1bytes += n1.n_len;
            n2bytes += n2.n_len;
            carry = 0;
            while ((n1bytes > 0) && (n2bytes > 0)) {
                // add the two numbers together
                tmp = n1.n_value[n1ptr--] + n2.n_value[n2ptr--] + carry;
                // check if they are >= 10 (impossible to be more then 18)
                if (tmp >= Libbcmath.BASE) {
                    carry = 1;
                    tmp -= Libbcmath.BASE; // yep, subtract 10, add a carry
                } else {
                    carry = 0;
                }
                sum.n_value[sumptr] = tmp;
                sumptr--;
                n1bytes--;
                n2bytes--;
            }

            // Now add carry the [rest of the] longer integer part.
            if (n1bytes === 0) {
                // n2 is a bigger number then n1
                while (n2bytes-- > 0) {
                    tmp = n2.n_value[n2ptr--] + carry;
                    if (tmp >= Libbcmath.BASE) {
                        carry = 1;
                        tmp -= Libbcmath.BASE;
                    } else {
                        carry = 0;
                    }
                    sum.n_value[sumptr--] = tmp;
                }
            } else {
                // n1 is bigger then n2..
                while (n1bytes-- > 0) {
                    tmp = n1.n_value[n1ptr--] + carry;
                    if (tmp >= Libbcmath.BASE) {
                        carry = 1;
                        tmp -= Libbcmath.BASE;
                    } else {
                        carry = 0;
                    }
                    sum.n_value[sumptr--] = tmp;
                }
            }

            // Set final carry.
            if (carry === 1) {
                sum.n_value[sumptr] += 1;
            }

            // Adjust sum and return.
            Libbcmath._bc_rm_leading_zeros(sum);
            return sum;
        },

        /**
         * Perform a subtraction
         *
         * Perform subtraction: N2 is subtracted from N1 and the value is
         *  returned.  The signs of N1 and N2 are ignored.  Also, N1 is
         *  assumed to be larger than N2.  SCALE_MIN is the minimum scale
         *  of the result.
         *
         * Basic school maths says to subtract 2 numbers..
         * 1. make them the same length, the decimal places, and the integer part
         * 2. start from the right and subtract the two numbers from each other
         * 3. if the sum of the 2 numbers < 0, carry -1 to the next set and add 10
         * (ie 18 > carry 1 becomes 8). thus 0.9 + 0.9 = 1.8
         *
         * @param {bc_num} n1
         * @param {bc_num} n2
         * @param {int} scaleMin
         * @return bc_num
         */
        _bc_do_sub: function (n1, n2, scaleMin) {
            let diff; // bc_num
            let diffScale, diffLen; // int
            let minScale, minLen; // int
            let n1ptr, n2ptr, diffptr; // int
            let borrow, count, val; // int
            // Allocate temporary storage.
            diffLen = Libbcmath.MAX(n1.n_len, n2.n_len);
            diffScale = Libbcmath.MAX(n1.n_scale, n2.n_scale);
            minLen = Libbcmath.MIN(n1.n_len, n2.n_len);
            minScale = Libbcmath.MIN(n1.n_scale, n2.n_scale);
            diff = Libbcmath.bc_new_num(diffLen, Libbcmath.MAX(diffScale, scaleMin));

            /* Not needed?
            // Zero extra digits made by scaleMin.
            */

            // Initialize the subtract.
            n1ptr = (n1.n_len + n1.n_scale - 1);
            n2ptr = (n2.n_len + n2.n_scale - 1);
            diffptr = (diffLen + diffScale - 1);

            // Subtract the numbers.
            borrow = 0;

            // Take care of the longer scaled number.
            if (n1.n_scale !== minScale) {
                // n1 has the longer scale
                for (count = n1.n_scale - minScale; count > 0; count--) {
                    diff.n_value[diffptr--] = n1.n_value[n1ptr--];
                }
            } else {
                // n2 has the longer scale
                for (count = n2.n_scale - minScale; count > 0; count--) {
                    val = 0 - n2.n_value[n2ptr--] - borrow;
                    if (val < 0) {
                        val += Libbcmath.BASE;
                        borrow = 1;
                    } else {
                        borrow = 0;
                    }
                    diff.n_value[diffptr--] = val;
                }
            }

            // Now do the equal length scale and integer parts.
            for (count = 0; count < minLen + minScale; count++) {
                val = n1.n_value[n1ptr--] - n2.n_value[n2ptr--] - borrow;
                if (val < 0) {
                    val += Libbcmath.BASE;
                    borrow = 1;
                } else {
                    borrow = 0;
                }
                diff.n_value[diffptr--] = val;
            }

            // If n1 has more digits then n2, we now do that subtract.
            if (diffLen !== minLen) {
                for (count = diffLen - minLen; count > 0; count--) {
                    val = n1.n_value[n1ptr--] - borrow;
                    if (val < 0) {
                        val += Libbcmath.BASE;
                        borrow = 1;
                    } else {
                        borrow = 0;
                    }
                    diff.n_value[diffptr--] = val;
                }
            }

            // Clean up and return.
            Libbcmath._bc_rm_leading_zeros(diff);
            return diff;
        },

        /**
         *
         * @param {int} length
         * @param {int} scale
         * @return bc_num
         */
        bc_new_num: function (length, scale) {
            let temp; // bc_num
            temp = new Libbcmath.bc_num(); // eslint-disable-line new-cap
            temp.n_sign = Libbcmath.PLUS;
            temp.n_len = length;
            temp.n_scale = scale;
            temp.n_value = Libbcmath.safe_emalloc(1, length + scale, 0);
            Libbcmath.memset(temp.n_value, 0, 0, length + scale);
            return temp;
        },

        safe_emalloc: function (size, len, extra) {
            return Array((size * len) + extra);
        },

        /**
         * Create a new number
         */
        bc_init_num: function () {
            return new Libbcmath.bc_new_num(1, 0); // eslint-disable-line new-cap
        },

        _bc_rm_leading_zeros: function (num) {
            // We can move n_value to point to the first non zero digit!
            while ((num.n_value[0] === 0) && (num.n_len > 1)) {
                num.n_value.shift();
                num.n_len--;
            }
        },

        /**
         * Convert to bc_num detecting scale
         */
        php_str2num: function (str) {
            let p;
            p = str.indexOf('.');
            if (p === -1) {
                return Libbcmath.bc_str2num(str, 0);
            } else {
                return Libbcmath.bc_str2num(str, (str.length - p));
            }
        },

        CH_VAL: function (c) {
            return c - '0'; // ??
        },

        BCD_CHAR: function (d) {
            return d + '0'; // ??
        },

        isdigit: function (c) {
            return isNaN(parseInt(c, 10));
        },

        bc_str2num: function (strIn, scale) {
            let str, num, ptr, digits, strscale, zeroInt, nptr
            // remove any non-expected characters
            // Check for valid number and count digits.

            str = strIn.split(''); // convert to array
            ptr = 0; // str
            digits = 0;
            strscale = 0;
            zeroInt = false;
            if ((str[ptr] === '+') || (str[ptr] === '-')) {
                ptr++; // Sign
            }
            while (str[ptr] === '0') {
                ptr++; // Skip leading zeros.
            }
            // while (Libbcmath.isdigit(str[ptr])) {
            while ((str[ptr]) % 1 === 0) { // Libbcmath.isdigit(str[ptr])) {
                ptr++;
                digits++; // digits
            }

            if (str[ptr] === '.') {
                ptr++; // decimal point
            }
            // while (Libbcmath.isdigit(str[ptr])) {
            while ((str[ptr]) % 1 === 0) { // Libbcmath.isdigit(str[ptr])) {
                ptr++;
                strscale++; // digits
            }

            if ((str[ptr]) || (digits + strscale === 0)) {
                // invalid number, return 0
                return Libbcmath.bc_init_num();
            }

            // Adjust numbers and allocate storage and initialize fields.
            strscale = Libbcmath.MIN(strscale, scale);
            if (digits === 0) {
                zeroInt = true;
                digits = 1;
            }

            num = Libbcmath.bc_new_num(digits, strscale);

            // Build the whole number.
            ptr = 0; // str
            if (str[ptr] === '-') {
                num.n_sign = Libbcmath.MINUS;
                ptr++;
            } else {
                num.n_sign = Libbcmath.PLUS;
                if (str[ptr] === '+') {
                    ptr++;
                }
            }
            while (str[ptr] === '0') {
                ptr++; // Skip leading zeros.
            }

            nptr = 0; // (*num)->n_value;
            if (zeroInt) {
                num.n_value[nptr++] = 0;
                digits = 0;
            }
            for (; digits > 0; digits--) {
                num.n_value[nptr++] = Libbcmath.CH_VAL(str[ptr++]);
            }

            // Build the fractional part.
            if (strscale > 0) {
                ptr++; // skip the decimal point!
                for (; strscale > 0; strscale--) {
                    num.n_value[nptr++] = Libbcmath.CH_VAL(str[ptr++]);
                }
            }

            return num;
        },

        cint: function (v) {
            if (typeof v === 'undefined') {
                v = 0;
            }
            let x = parseInt(v, 10);
            if (isNaN(x)) {
                x = 0;
            }
            return x;
        },

        /**
         * Basic min function
         * @param {int} a
         * @param {int} b
         */
        MIN: function (a, b) {
            return ((a > b) ? b : a);
        },

        /**
         * Basic max function
         * @param {int} a
         * @param {int} b
         */
        MAX: function (a, b) {
            return ((a > b) ? a : b);
        },

        /**
         * Basic odd function
         * @param {int} a
         */
        ODD: function (a) {
            return (a & 1);
        },

        /**
         * replicate c function
         * @param {array} r     return (by reference)
         * @param {int} ptr
         * @param {string} chr    char to fill
         * @param {int} len       length to fill
         */
        memset: function (r, ptr, chr, len) {
            let i;
            for (i = 0; i < len; i++) {
                r[ptr + i] = chr;
            }
        },

        /**
         * Replacement c function
         * Obviously can't work like c does, so we've added an "offset"
         * param so you could do memcpy(dest+1, src, len) as memcpy(dest, 1, src, len)
         * Also only works on arrays
         */
        memcpy: function (dest, ptr, src, srcptr, len) {
            let i;
            for (i = 0; i < len; i++) {
                dest[ptr + i] = src[srcptr + i];
            }
            return true;
        },

        /**
         * Determine if the number specified is zero or not
         * @param {bc_num} num    number to check
         * @return boolean      true when zero, false when not zero.
         */
        bc_is_zero: function (num) {
            let count; // int
            let nptr; // int
            // Quick check.
            // Initialize
            count = num.n_len + num.n_scale;
            nptr = 0; // num->n_value;
            // The check
            while ((count > 0) && (num.n_value[nptr++] === 0)) {
                count--;
            }

            if (count !== 0) {
                return false;
            } else {
                return true;
            }
        },

        bc_out_of_memory: function () {
            throw new Error('(BC) Out of memory');
        }
    }
    return Libbcmath;
}

/*
    ----- Title -----
    //   example 1: _phpCastString(true)
    //   returns 1: '1'
    //   example 2: _phpCastString(false)
    //   returns 2: ''
    //   example 3: _phpCastString('foo')
    //   returns 3: 'foo'
    //   example 4: _phpCastString(0/0)
    //   returns 4: 'NAN'
    //   example 5: _phpCastString(1/0)
    //   returns 5: 'INF'
    //   example 6: _phpCastString(-1/0)
    //   returns 6: '-INF'
    //   example 7: _phpCastString(null)
    //   returns 7: ''
    //   example 8: _phpCastString(undefined)
    //   returns 8: ''
    //   example 9: _phpCastString([])
    //   returns 9: 'Array'
    //   example 10: _phpCastString({})
    //   returns 10: 'Object'
    //   example 11: _phpCastString(0)
    //   returns 11: '0'
    //   example 12: _phpCastString(1)
    //   returns 12: '1'
    //   example 13: _phpCastString(3.14)
    //   returns 13: '3.14'
*/
__Helpers._phpCastString = function (value) {
    let type = typeof value;

    switch (type) {
        case 'boolean':
            return value ? '1' : '';
        case 'string':
            return value;
        case 'number':
            if (isNaN(value)) {
                return 'NAN';
            }

            if (!isFinite(value)) {
                return (value < 0 ? '-' : '') + 'INF';
            }

            return value + '';
        case 'undefined':
            return '';
        case 'object':
            if (Array.isArray(value)) {
                return 'Array';
            }

            if (value !== null) {
                return 'Object';
            }

            return '';
        case 'function':
        // fall through
        default:
            throw new Error('Unsupported value type')
    }
}

/* -------------------------------------------------------- END HELPERS -------------------------------------------------------- */



__._helpers = __Helpers;



/* -------------------------------------------------------- INFO -------------------------------------------------------- */
var __Info = {};

/*
    ----- Title -----
    //        example 1: version_compare('8.2.5rc', '8.2.5a')
    //        returns 1: 1
    //        example 2: version_compare('8.2.50', '8.2.52', '<')
    //        returns 2: true
    //        example 3: version_compare('5.3.0-dev', '5.3.0')
    //        returns 3: -1
    //        example 4: version_compare('4.1.0.52','4.01.0.51')
    //        returns 4: 1
*/
__Info.version_compare = function (v1, v2, operator) {
    let i;
    let x;
    let compare = 0;

    // vm maps textual PHP versions to negatives so they're less than 0.
    // PHP currently defines these as CASE-SENSITIVE. It is important to
    // leave these as negatives so that they can come before numerical versions
    // and as if no letters were there to begin with.
    // (1alpha is < 1 and < 1.1 but > 1dev1)
    // If a non-numerical value can't be mapped to this table, it receives
    // -7 as its value.
    let vm = {
        'dev': -6,
        'alpha': -5,
        'a': -5,
        'beta': -4,
        'b': -4,
        'RC': -3,
        'rc': -3,
        '#': -2,
        'p': 1,
        'pl': 1
    }

    // This function will be called to prepare each version argument.
    // It replaces every _, -, and + with a dot.
    // It surrounds any nonsequence of numbers/dots with dots.
    // It replaces sequences of dots with a single dot.
    //    version_compare('4..0', '4.0') === 0
    // Important: A string of 0 length needs to be converted into a value
    // even less than an unexisting value in vm (-7), hence [-8].
    // It's also important to not strip spaces because of this.
    //   version_compare('', ' ') === 1
    let _prepVersion = function (v) {
        v = ('' + v).replace(/[_\-+]/g, '.');
        v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
        return (!v.length ? [-8] : v.split('.'));
    }
    // This converts a version component to a number.
    // Empty component becomes 0.
    // Non-numerical component becomes a negative number.
    // Numerical component becomes itself as an integer.
    let _numVersion = function (v) {
        return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10));
    }

    v1 = _prepVersion(v1);
    v2 = _prepVersion(v2);
    x = Math.max(v1.length, v2.length);
    for (i = 0; i < x; i++) {
        if (v1[i] === v2[i]) {
            continue;
        }
        v1[i] = _numVersion(v1[i]);
        v2[i] = _numVersion(v2[i]);
        if (v1[i] < v2[i]) {
            compare = -1;
            break;
        } else if (v1[i] > v2[i]) {
            compare = 1;
            break;
        }
    }
    if (!operator) {
        return compare;
    }

    // Important: operator is CASE-SENSITIVE.
    // "No operator" seems to be treated as "<."
    // Any other values seem to make the function return null.
    switch (operator) {
        case '>':
        case 'gt':
            return (compare > 0);
        case '>=':
        case 'ge':
            return (compare >= 0);
        case '<=':
        case 'le':
            return (compare <= 0);
        case '===':
        case '=':
        case 'eq':
            return (compare === 0);
        case '<>':
        case '!==':
        case 'ne':
            return (compare !== 0);
        case '':
        case '<':
        case 'lt':
            return (compare < 0);
        default:
            return null;
    }
}

/*
    ----- Title -----
    //   example 1: set_time_limit(4)
    //   returns 1: undefined
*/
__Info.set_time_limit = function (seconds) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};

    setTimeout(function () {
        if (!$locutus.php.timeoutStatus) {
            $locutus.php.timeoutStatus = true;
        }
        throw new Error('Maximum execution time exceeded');
    },
        seconds * 1000);
}

/*
    ----- Title -----
    //   example 1: ini_set('date.timezone', 'Asia/Hong_Kong')
    //   example 1: ini_set('date.timezone', 'America/Chicago')
    //   returns 1: 'Asia/Hong_Kong'
*/
__Info.ini_set = function (letname, newvalue) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.ini = $locutus.php.ini || {};

    $locutus.php.ini = $locutus.php.ini || {};
    $locutus.php.ini[letname] = $locutus.php.ini[letname] || {};

    let oldval = $locutus.php.ini[letname].local_value;

    let lowerStr = (newvalue + '').toLowerCase().trim();
    if (newvalue === true || lowerStr === 'on' || lowerStr === '1') {
        newvalue = 'on';
    }
    if (newvalue === false || lowerStr === 'off' || lowerStr === '0') {
        newvalue = 'off';
    }

    let _setArr = function (oldval) {
        // Although these are set individually, they are all accumulated
        if (typeof oldval === 'undefined') {
            $locutus.ini[letname].local_value = [];
        }
        $locutus.ini[letname].local_value.push(newvalue);
    }

    switch (letname) {
        case 'extension':
            _setArr(oldval, newvalue);
            break;
        default:
            $locutus.php.ini[letname].local_value = newvalue;
            break;
    }

    return oldval;
}

/*
    ----- Title -----
    //   example 1: getenv('LC_ALL')
    //   returns 1: false
*/
__Info.getenv = function (letname) {
    if (typeof process !== 'undefined' || !process.env || !process.env[letname]) {
        return false;
    }

    return process.env[letname];
}

/*
    ----- Title -----
    //   example 1: assert_options('ASSERT_CALLBACK')
    //   returns 1: null
*/
__Info.assert_options = function (what, value) {
    let iniKey, defaultVal;
    switch (what) {
        case 'ASSERT_ACTIVE':
            iniKey = 'assert.active';
            defaultVal = 1;
            break;
        case 'ASSERT_WARNING':
            iniKey = 'assert.warning';
            defaultVal = 1;
            let msg = 'We have not yet implemented warnings for us to throw ';
            msg += 'in JavaScript (assert_options())';
            throw new Error(msg);
        case 'ASSERT_BAIL':
            iniKey = 'assert.bail';
            defaultVal = 0;
            break;
        case 'ASSERT_QUIET_EVAL':
            iniKey = 'assert.quiet_eval';
            defaultVal = 0;
            break;
        case 'ASSERT_CALLBACK':
            iniKey = 'assert.callback';
            defaultVal = null;
            break;
        default:
            throw new Error('Improper type for assert_options()');
    }

    // I presume this is to be the most recent value, instead of the default value
    let iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')(iniKey) : undefined) || defaultVal;

    return iniVal;
}

/*
    ----- Title -----
    //   example 1: ini_set('date.timezone', 'Asia/Hong_Kong')
    //   example 1: ini_get('date.timezone')
    //   returns 1: 'Asia/Hong_Kong'
*/
__Info.ini_get = function (letname) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.ini = $locutus.php.ini || {};

    if ($locutus.php.ini[letname] && $locutus.php.ini[letname].local_value !== undefined) {
        if ($locutus.php.ini[letname].local_value === null) {
            return '';
        }
        return $locutus.php.ini[letname].local_value;
    }

    return '';
}

/* -------------------------------------------------------- END INFO -------------------------------------------------------- */



__._info = __Info;



/* -------------------------------------------------------- LET -------------------------------------------------------- */
var __Let = {};

/*
    ----- Title -----
    //   example 1: is_scalar(186.31)
    //   returns 1: true
    //   example 2: is_scalar({0: 'Kevin van Zonneveld'})
    //   returns 2: false
*/
__Let.is_scalar = function (mixedlet) {
    return (/boolean|number|string/).test(typeof mixedlet);
}

/*
    ----- Title -----
     //   example 1: is_int(23)
    //   returns 1: true
    //   example 2: is_int('23')
    //   returns 2: false
    //   example 3: is_int(23.5)
    //   returns 3: false
    //   example 4: is_int(true)
    //   returns 4: false
*/
__Let.is_int = function (mixedlet) {
    return mixedlet === +mixedlet && isFinite(mixedlet) && !(mixedlet % 1);
}

/*
    ----- Title -----
    //   example 1: let_dump(1)
    //   returns 1: 'int(1)'
*/
__Let.let_dump = function () {
    let output = '';
    let padChar = ' ';
    let padVal = 4;
    let lgth = 0;
    let i = 0;

    let _getFuncName = function (fn) {
        let name = (/\W*function\s+([\w$]+)\s*\(/)
            .exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    }

    let _repeatChar = function (len, padChar) {
        let str = '';
        for (let i = 0; i < len; i++) {
            str += padChar;
        }
        return str;
    }
    let _getInnerVal = function (val, thickPad) {
        let ret = '';
        if (val === null) {
            ret = 'NULL';
        } else if (typeof val === 'boolean') {
            ret = 'bool(' + val + ')';
        } else if (typeof val === 'string') {
            ret = 'string(' + val.length + ') "' + val + '"';
        } else if (typeof val === 'number') {
            if (parseFloat(val) === parseInt(val, 10)) {
                ret = 'int(' + val + ')';
            } else {
                ret = 'float(' + val + ')';
            }
        } else if (typeof val === 'undefined') {
            // The remaining are not PHP behavior because these values
            // only exist in this exact form in JavaScript
            ret = 'undefined';
        } else if (typeof val === 'function') {
            let funcLines = val.toString()
                .split('\n');
            ret = '';
            for (let i = 0, fll = funcLines.length; i < fll; i++) {
                ret += (i !== 0 ? '\n' + thickPad : '') + funcLines[i];
            }
        } else if (val instanceof Date) {
            ret = 'Date(' + val + ')';
        } else if (val instanceof RegExp) {
            ret = 'RegExp(' + val + ')';
        } else if (val.nodeName) {
            // Different than PHP's DOMElement
            switch (val.nodeType) {
                case 1:
                    if (typeof val.namespaceURI === 'undefined' ||
                        val.namespaceURI === 'http://www.w3.org/1999/xhtml') {
                        // Undefined namespace could be plain XML, but namespaceURI not widely supported
                        ret = 'HTMLElement("' + val.nodeName + '")';
                    } else {
                        ret = 'XML Element("' + val.nodeName + '")';
                    }
                    break;
                case 2:
                    ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')';
                    break;
                case 3:
                    ret = 'TEXT_NODE(' + val.nodeValue + ')';
                    break;
                case 4:
                    ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')';
                    break;
                case 5:
                    ret = 'ENTITY_REFERENCE_NODE';
                    break;
                case 6:
                    ret = 'ENTITY_NODE';
                    break;
                case 7:
                    ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')';
                    break;
                case 8:
                    ret = 'COMMENT_NODE(' + val.nodeValue + ')';
                    break;
                case 9:
                    ret = 'DOCUMENT_NODE';
                    break;
                case 10:
                    ret = 'DOCUMENT_TYPE_NODE';
                    break;
                case 11:
                    ret = 'DOCUMENT_FRAGMENT_NODE';
                    break;
                case 12:
                    ret = 'NOTATION_NODE';
                    break;
            }
        }
        return ret;
    }

    let _formatArray = function (obj, curDepth, padVal, padChar) {
        if (curDepth > 0) {
            curDepth++;
        }

        let basePad = _repeatChar(padVal * (curDepth - 1), padChar);
        let thickPad = _repeatChar(padVal * (curDepth + 1), padChar);
        let str = '';
        let val = '';

        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor && _getFuncName(obj.constructor) === 'LOCUTUS_Resource') {
                return obj.let_dump();
            }
            lgth = 0;
            for (let someProp in obj) {
                if (obj.hasOwnProperty(someProp)) {
                    lgth++;
                }
            }
            str += 'array(' + lgth + ') {\n';
            for (let key in obj) {
                let objVal = obj[key];
                if (typeof objVal === 'object' &&
                    objVal !== null &&
                    !(objVal instanceof Date) &&
                    !(objVal instanceof RegExp) &&
                    !objVal.nodeName) {
                    str += thickPad;
                    str += '[';
                    str += key;
                    str += '] =>\n';
                    str += thickPad;
                    str += _formatArray(objVal, curDepth + 1, padVal, padChar);
                } else {
                    val = _getInnerVal(objVal, thickPad);
                    str += thickPad;
                    str += '[';
                    str += key;
                    str += '] =>\n';
                    str += thickPad;
                    str += val;
                    str += '\n';
                }
            }
            str += basePad + '}\n';
        } else {
            str = _getInnerVal(obj, thickPad);
        }
        return str;
    }

    output = _formatArray(arguments[0], 0, padVal, padChar);
    for (i = 1; i < arguments.length; i++) {
        output += '\n' + _formatArray(arguments[i], 0, padVal, padChar);
    }

    __String.echo(output);

    // Not how PHP does it, but helps us test:
    return output;
}

/* -------------------------------------------------------- END LET -------------------------------------------------------- */



__._let = __Let;



/* -------------------------------------------------------- I18N -------------------------------------------------------- */
var __I18n = {};

/*
    ----- Title -----
     //   example 1: i18n_loc_get_default()
    //   returns 1: 'en_US_POSIX'
    //   example 2: i18n_loc_set_default('pt_PT')
    //   example 2: i18n_loc_get_default()
    //   returns 2: 'pt_PT'
*/
__I18n.i18n_loc_get_default = function (param) {
    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};
    $locutus.php.locales = $locutus.php.locales || {};

    return $locutus.php.locale_default || 'en_US_POSIX';
}

/* -------------------------------------------------------- END I18N -------------------------------------------------------- */



__._i18n = __I18n;




/* -------------------------------------------------------- XML -------------------------------------------------------- */
var __Xml = {};

/*
    ----- Title -----
    //   example 1: utf8_encode('Kevin van Zonneveld')
    //   returns 1: 'Kevin van Zonneveld'
*/
__Xml.utf8_encode = function (argString) {
    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    let string = (argString + '');
    let utftext = '';
    let start;
    let end;
    let stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (let n = 0; n < stringl; n++) {
        let c1 = string.charCodeAt(n);
        let enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192,
                (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) !== 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224,
                ((c1 >> 6) & 63) | 128,
                (c1 & 63) | 128
            );
        } else {
            // surrogate pairs
            if ((c1 & 0xFC00) !== 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            let c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) !== 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240,
                ((c1 >> 12) & 63) | 128,
                ((c1 >> 6) & 63) | 128,
                (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

/*
    ----- Title -----
    //   example 1: utf8_decode('Kevin van Zonneveld')
    //   returns 1: 'Kevin van Zonneveld'
*/
__Xml.utf8_decode = function (strData) {
    let tmpArr = [];
    let i = 0;
    let c1 = 0;
    let seqlen = 0;

    strData += '';

    while (i < strData.length) {
        c1 = strData.charCodeAt(i) & 0xFF;
        seqlen = 0;

        // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
        if (c1 <= 0xBF) {
            c1 = (c1 & 0x7F);
            seqlen = 1;
        } else if (c1 <= 0xDF) {
            c1 = (c1 & 0x1F);
            seqlen = 2;
        } else if (c1 <= 0xEF) {
            c1 = (c1 & 0x0F);
            seqlen = 3;
        } else {
            c1 = (c1 & 0x07);
            seqlen = 4;
        }

        for (let ai = 1; ai < seqlen; ++ai) {
            c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F));
        }

        if (seqlen === 4) {
            c1 -= 0x10000;
            tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)));
            tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
        } else {
            tmpArr.push(String.fromCharCode(c1));
        }

        i += seqlen;
    }

    return tmpArr.join('');
}

/* -------------------------------------------------------- END XML -------------------------------------------------------- */



__._xml = __Xml;



/* -------------------------------------------------------- DATE TIME -------------------------------------------------------- */
var __DateTime = {};

/*
    ----- Checks the validity of the date formed by the arguments. A date is considered valid if each parameter is properly defined. -----
    //   example 1: checkdate(12, 31, 2000)
    //   returns 1: true
    //   example 2: checkdate(2, 29, 2001)
    //   returns 2: false
    //   example 3: checkdate(3, 31, 2008)
    //   returns 3: true
    //   example 4: checkdate(1, 390, 2000)
    //   returns 4: false
*/
__DateTime.checkdate = function (y, m, d) {
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
    .getDate();
}

/*
    ----- Returns a string formatted according to the given format string using the given integer timestamp or the current time if no timestamp is given -----
    //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
    //   returns 1: '07:09:40 m is month'
    //   example 2: date('F j, Y, g:i a', 1062462400)
    //   returns 2: 'September 2, 2003, 12:26 am'
    //   example 3: date('Y W o', 1062462400)
    //   returns 3: '2003 36 2003'
    //   example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
    //   example 4: $x = $x + ''
    //   example 4: var $result = $x.length // 2009 01 09
    //   returns 4: 10
    //   example 5: date('W', 1104534000)
    //   returns 5: '52'
    //   example 6: date('B t', 1104534000)
    //   returns 6: '999 31'
    //   example 7: date('W U', 1293750000.82); // 2010-12-31
    //   returns 7: '52 1293750000'
    //   example 8: date('W', 1293836400); // 2011-01-01
    //   returns 8: '52'
    //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    //   returns 9: '52 2011-01-02'
*/
__DateTime.date = function (format, timestamp) {
    let jsdate;
    let f;
    // Keep this here (works, but for code commented-out below for file size reasons)
    let txtWords = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    let formatChr = /\\?(.?)/gi;
    let formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };

    let _pad = function (n, c) {
        n = String(n);
        while (n.length < c) {
            n = '0' + n;
        }
        return n;
    };

    f = {
        d: function () {
            // Day
            // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () {
            // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function () {
            // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () {
            // Full day name; Monday...Sunday
            return txtWords[f.w()] + 'day';
        },
        N: function () {
            // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () {
            // Ordinal suffix for day of month; st, nd, rd, th
            let j = f.j();
            let i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
                i = 0;
            }
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function () {
            // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () {
            // Day of year; 0..365
            let a = new Date(f.Y(), f.n() - 1, f.j());
            let b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },
        W: function () {
            // ISO-8601 week number
            let a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            let b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },
        F: function () {
            // Full month name; January...December
            return txtWords[6 + f.n()];
        },
        m: function () {
            // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () {
            // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function () {
            // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () {
            // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getDate();
        },
        L: function () {
            // Is leap year?; 0 or 1
            let j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function () {
            // ISO-8601 year
            let n = f.n();
            let W = f.W();
            let Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function () {
            // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () {
            // Last two digits of year; 00...99
            return f.Y().toString().slice(-2);
        },
        a: function () {
            // am or pm
            return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A: function () {
            // AM or PM
            return f.a().toUpperCase();
        },
        B: function () {
            // Swatch Internet time; 000..999
            let H = jsdate.getUTCHours() * 36e2;
            // Hours
            let i = jsdate.getUTCMinutes() * 60;
            // Minutes
            // Seconds
            let s = jsdate.getUTCSeconds();
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () {
            // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () {
            // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () {
            // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () {
            // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () {
            // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () {
            // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () {
            // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },
        e: function () {
            // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            throw new Error('Not supported (see source code of date() for timezone on how to add support)');
        },
        I: function () {
            // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            let a = new Date(f.Y(), 0);
            // Jan 1
            let c = Date.UTC(f.Y(), 0);
            // Jan 1 UTC
            let b = new Date(f.Y(), 6);
            // Jul 1
            // Jul 1 UTC
            let d = Date.UTC(f.Y(), 6);
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function () {
            // Difference to GMT in hour format; e.g. +0200
            let tzo = jsdate.getTimezoneOffset();
            let a = Math.abs(tzo);
            return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () {
            // Difference to GMT w/colon; e.g. +02:00
            let O = f.O();
            return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T: function () {
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list()             
            return 'UTC';
        },
        Z: function () {
            // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },
        c: function () {
            // ISO-8601 date.
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () {
            // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () {
            // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };

    let _date = function (format, timestamp) {
        jsdate = (timestamp === undefined ? new Date() // Not provided
            : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
                : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };

    return _date(format, timestamp);
}

/*
    ----- Returns associative array with detailed info about given date -----
    //   example 1: date_parse('2006-12-12 10:00:00')
    //   returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0, is_localtime: false}
*/
__DateTime.date_parse = function (date) {
    let str_to_time = __DateTime.strtotime;
    //var strtotime = require('../datetime/strtotime')
    let ts;

    try {
        ts = str_to_time(date);
    } catch (e) {
        ts = false;
    }

    if (!ts) {
        return false;
    }

    let dt = new Date(ts * 1000);

    let retObj = {};

    retObj.year = dt.getFullYear();
    retObj.month = dt.getMonth() + 1;
    retObj.day = dt.getDate();
    retObj.hour = dt.getHours();
    retObj.minute = dt.getMinutes();
    retObj.second = dt.getSeconds();
    retObj.fraction = parseFloat('0.' + dt.getMilliseconds());
    retObj.is_localtime = dt.getTimezoneOffset() !== 0;

    return retObj;
}

/*
    ----- Returns an associative array containing the date information of the timestamp, or the current local time if no timestamp is given. -----
    //   example 1: getdate(1055901520)
    //   returns 1: {'seconds': 40, 'minutes': 58, 'hours': 1, 'mday': 18, 'wday': 3, 'mon': 6, 'year': 2003, 'yday': 168, 'weekday': 'Wednesday', 'month': 'June', '0': 1055901520}
*/
__DateTime.getdate = function (timestamp) {
    let _w = [
        'Sun',
        'Mon',
        'Tues',
        'Wednes',
        'Thurs',
        'Fri',
        'Satur'
    ];
    let _m = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    let d = typeof timestamp === 'undefined' ? new Date()
        : timestamp instanceof Date ? new Date(timestamp)  // Not provided
            : new Date(timestamp * 1000); // Javascript Date() // UNIX timestamp (auto-convert to int)
    
    let w = d.getDay();
    let m = d.getMonth();
    let y = d.getFullYear();
    let r = {};

    r.seconds = d.getSeconds();
    r.minutes = d.getMinutes();
    r.hours = d.getHours();
    r.mday = d.getDate();
    r.wday = w;
    r.mon = m + 1;
    r.year = y;
    r.yday = Math.floor((d - (new Date(y, 0, 1))) / 86400000);
    r.weekday = _w[w] + 'day';
    r.month = _m[m];
    r['0'] = parseInt(d.getTime() / 1000, 10);

    return r;
}

/*
    ----- This is an interface to gettimeofday(2). It returns an associative array containing the data returned from the system call. -----
    //   example 1: var $obj = gettimeofday()
    //   example 1: var $result = ('sec' in $obj && 'usec' in $obj && 'minuteswest' in $obj &&80, 'dsttime' in $obj)
    //   returns 1: true
    //   example 2: var $timeStamp = gettimeofday(true)
    //   example 2: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
    //   returns 2: true
*/
__DateTime.gettimeofday = function (returnFloat) {
    let t = new Date();
    let y = 0;

    if (returnFloat) {
        return t.getTime() / 1000;
    }

    // Store current year.
    y = t.getFullYear();
    return {
        sec: t.getUTCSeconds(),
        usec: t.getUTCMilliseconds() * 1000,
        minuteswest: t.getTimezoneOffset(),
        // Compare Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC to see if DST is observed.
        dsttime: 0 + (((new Date(y, 0)) - Date.UTC(y, 0)) !== ((new Date(y, 6)) - Date.UTC(y, 6)))
    };
}

/*
    ----- Format a GMT/UTC date/time. Identical to the date() function except that the time returned is Greenwich Mean Time (GMT). -----
    //   example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
    //   returns 1: '07:09:40 m is month'
*/
__DateTime.gmdate = function (format, timestamp) {
    let date = __DateTime.date;

    let dt = typeof timestamp === 'undefined' ? new Date() // Not provided
        : timestamp instanceof Date ? new Date(timestamp) // Javascript Date()
        : new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)

    timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000;

    return date(format, timestamp);
}

/*
    ----- Get Unix timestamp for a GMT date -----
    //   example 1: gmmktime(14, 10, 2, 2, 1, 2008)
    //   returns 1: 1201875002
    //   example 2: gmmktime(0, 0, -1, 1, 1, 1970)
    //   returns 2: -1
*/
__DateTime.gmmktime = function () {
    let d = new Date();
    let r = arguments;
    let i = 0;
    let e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

    for (i = 0; i < e.length; i++) {
        if (typeof r[i] === 'undefined') {
            r[i] = d['getUTC' + e[i]]();
            // +1 to fix JS months.
            r[i] += (i === 3);
        } else {
            r[i] = parseInt(r[i], 10);
            if (isNaN(r[i])) {
                return false;
            }
        }
    }

    // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
    r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

    // Set year, month (-1 to fix JS months), and date.
    // !This must come before the call to setHours!
    d.setUTCFullYear(r[5], r[3] - 1, r[4]);

    // Set hours, minutes, and seconds.
    d.setUTCHours(r[0], r[1], r[2]);

    let time = d.getTime();

    // Divide milliseconds by 1000 to return seconds and drop decimal.
    // Add 1 second if negative or it'll be off from PHP by 1 second.
    return (time / 1e3 >> 0) - (time < 0);
}

/*
    ----- Format a GMT/UTC time/date according to locale settings -----
    //   example 1: gmstrftime("%A", 1062462400)
    //   returns 1: 'Tuesday'
*/
__DateTime.gmstrftime = function (format, timestamp) {
    let strftime = __DateTime.strftime;

    let _date = (typeof timestamp === 'undefined')
        ? new Date()
        : (timestamp instanceof Date)
            ? new Date(timestamp)
            : new Date(timestamp * 1000);

    timestamp = Date.parse(_date.toUTCString().slice(0, -4)) / 1000;

    return strftime(format, timestamp);
}

/*
    ----- Format a local time/date as integer -----
    //   example 1: idate('y', 1255633200)
    //   returns 1: 9
*/
__DateTime.idate = function (format, timestamp) {
    if (format === undefined) {
        throw new Error('idate() expects at least 1 parameter, 0 given');
    }
    if (!format.length || format.length > 1) {
        throw new Error('idate format is one char');
    }

    // @todo: Need to allow date_default_timezone_set() (check for $locutus.default_timezone and use)
    let _date = (typeof timestamp === 'undefined')
        ? new Date()
        : (timestamp instanceof Date)
            ? new Date(timestamp)
            : new Date(timestamp * 1000);
    let a;

    switch (format) {
        case 'B':
            return Math.floor(
                ((_date.getUTCHours() * 36e2) +
                (_date.getUTCMinutes() * 60) +
                _date.getUTCSeconds() + 36e2) / 86.4
            ) % 1e3;
        case 'd':
            return _date.getDate();
        case 'h':
            return _date.getHours() % 12 || 12;
        case 'H':
            return _date.getHours();
        case 'i':
            return _date.getMinutes();
        case 'I':
            // capital 'i'
            // Logic original by getimeofday().
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            a = _date.getFullYear();
            return 0 + (((new Date(a, 0)) - Date.UTC(a, 0)) !== ((new Date(a, 6)) - Date.UTC(a, 6)));
        case 'L':
            a = _date.getFullYear();
            return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0;
        case 'm':
            return _date.getMonth() + 1;
        case 's':
            return _date.getSeconds();
        case 't':
            return (new Date(_date.getFullYear(), _date.getMonth() + 1, 0)).getDate();
        case 'U':
            return Math.round(_date.getTime() / 1000);
        case 'w':
            return _date.getDay();
        case 'W':
            a = new Date(
                _date.getFullYear(),
                _date.getMonth(),
                _date.getDate() - (_date.getDay() || 7) + 3
            );
            return 1 + Math.round((a - (new Date(a.getFullYear(), 0, 4))) / 864e5 / 7);
        case 'y':
            // This function returns an integer, unlike _date()
            return parseInt((_date.getFullYear() + '').slice(2), 10) ;
        case 'Y':
            return _date.getFullYear();
        case 'z':
            return Math.floor((_date - new Date(_date.getFullYear(), 0, 1)) / 864e5);
        case 'Z':
            return -_date.getTimezoneOffset() * 60;
        default:
            throw new Error('Unrecognized _date format token');
    }
}

/*
    ----- Return current Unix timestamp with microseconds -----
    //   example 1: var $timeStamp = microtime(true)
    //   example 1: $timeStamp > 1000000000 && $timeStamp < 2000000000
    //   returns 1: true
    //   example 2: /^0\.[0-9]{1,6} [0-9]{10,10}$/.test(microtime())
    //   returns 2: true
*/
__DateTime.microtime = function (getAsFloat) {
    let s;
    let now;
    if (typeof performance !== 'undefined' && performance.now) {
        now = (performance.now() + performance.timing.navigationStart) / 1e3;
        if (getAsFloat) {
            return now;
        }

        // Math.round(now)
        s = now | 0;

        return (Math.round((now - s) * 1e6) / 1e6) + ' ' + s;
    } else {
        now = (Date.now ? Date.now() : new Date().getTime()) / 1e3;
        if (getAsFloat) {
          return now;
        }

        // Math.round(now)
        s = now | 0;

        return (Math.round((now - s) * 1e3) / 1e3) + ' ' + s;
    }
}

/*
    ----- Get Unix timestamp for a date -----
    //   example 1: mktime(14, 10, 2, 2, 1, 2008)
    //   returns 1: 1201875002
    //   example 2: mktime(0, 0, 0, 0, 1, 2008)
    //   returns 2: 1196467200
    //   example 3: var $make = mktime()
    //   example 3: var $td = new Date()
    //   example 3: var $real = Math.floor($td.getTime() / 1000)
    //   example 3: var $diff = ($real - $make)
    //   example 3: $diff < 5
    //   returns 3: true
    //   example 4: mktime(0, 0, 0, 13, 1, 1997)
    //   returns 4: 883612800
    //   example 5: mktime(0, 0, 0, 1, 1, 1998)
    //   returns 5: 883612800
    //   example 6: mktime(0, 0, 0, 1, 1, 98)
    //   returns 6: 883612800
    //   example 7: mktime(23, 59, 59, 13, 0, 2010)
    //   returns 7: 1293839999
    //   example 8: mktime(0, 0, -1, 1, 1, 1970)
    //   returns 8: -1
*/
__DateTime.mktime = function () {
    let d = new Date();
    let r = arguments;
    let i = 0;
    let e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

    for (i = 0; i < e.length; i++) {
        if (typeof r[i] === 'undefined') {
            r[i] = d['get' + e[i]]();
            // +1 to fix JS months.
            r[i] += (i === 3);
        } else {
            r[i] = parseInt(r[i], 10);
            if (isNaN(r[i])) {
                return false;
            }
        }
    }

    // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
    r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

    // Set year, month (-1 to fix JS months), and date.
    // !This must come before the call to setHours!
    d.setFullYear(r[5], r[3] - 1, r[4]);

    // Set hours, minutes, and seconds.
    d.setHours(r[0], r[1], r[2]);

    let time = d.getTime();

    // Divide milliseconds by 1000 to return seconds and drop decimal.
    // Add 1 second if negative or it'll be off from PHP by 1 second.
    return (time / 1e3 >> 0) - (time < 0);
}

/*
    ----- Format a local time/date according to locale settings -----
    //        example 1: strftime("%A", 1062462400); // Return value will depend on date and locale
    //        returns 1: 'Tuesday'
*/
__DateTime.strftime = function (fmt, timestamp) {
    //var setlocale = require('../strings/setlocale')
    let setlocale = __String.setlocale;

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;

    // ensure setup of localization variables takes place
    setlocale('LC_ALL', 0)

    let _xPad = function (x, pad, r) {
        if (typeof r === 'undefined') {
            r = 10;
        }
        for (; parseInt(x, 10) < r && r > 1; r /= 10) {
            x = pad.toString() + x;
        }
        return x.toString();
    };

    let locale = $locutus.php.localeCategories.LC_TIME;
    let lcTime = $locutus.php.locales[locale].LC_TIME;

    let _formats = {
        a: function (d) {
            return lcTime.a[d.getDay()];
        },
        A: function (d) {
            return lcTime.A[d.getDay()];
        },
        b: function (d) {
            return lcTime.b[d.getMonth()];
        },
        B: function (d) {
            return lcTime.B[d.getMonth()];
        },
        C: function (d) {
            return _xPad(parseInt(d.getFullYear() / 100, 10), 0);
        },
        d: ['getDate', '0'],
        e: ['getDate', ' '],
        g: function (d) {
            return _xPad(parseInt(this.G(d) / 100, 10), 0);
        },
        G: function (d) {
            let y = d.getFullYear();
            let V = parseInt(_formats.V(d), 10);
            let W = parseInt(_formats.W(d), 10);

            if (W > V) {
                y++;
            } else if (W === 0 && V >= 52) {
                y--;
            }

            return y;
        },
        H: ['getHours', '0'],
        I: function (d) {
            let I = d.getHours() % 12;
            return _xPad(I === 0 ? 12 : I, 0);
        },
        j: function (d) {
            let ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
            // Line differs from Yahoo implementation which would be
            // equivalent to replacing it here with:
            ms += d.getTimezoneOffset() * 60000;
            let doy = parseInt(ms / 60000 / 60 / 24, 10) + 1;
            return _xPad(doy, 0, 100);
        },
        k: ['getHours', '0'],
        // not in PHP, but implemented here (as in Yahoo)
        l: function (d) {
            let l = d.getHours() % 12;
            return _xPad(l === 0 ? 12 : l, ' ');
        },
        m: function (d) {
            return _xPad(d.getMonth() + 1, 0);
        },
        M: ['getMinutes', '0'],
        p: function (d) {
            return lcTime.p[d.getHours() >= 12 ? 1 : 0];
        },
        P: function (d) {
            return lcTime.P[d.getHours() >= 12 ? 1 : 0];
        },
        s: function (d) {
            // Yahoo uses return parseInt(d.getTime()/1000, 10);
            return Date.parse(d) / 1000;
        },
        S: ['getSeconds', '0'],
        u: function (d) {
            let dow = d.getDay();
            return ((dow === 0) ? 7 : dow);
        },
        U: function (d) {
            let doy = parseInt(_formats.j(d), 10);
            let rdow = 6 - d.getDay();
            let woy = parseInt((doy + rdow) / 7, 10);
            return _xPad(woy, 0);
        },
        V: function (d) {
            let woy = parseInt(_formats.W(d), 10);
            let dow11 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
            // First week is 01 and not 00 as in the case of %U and %W,
            // so we add 1 to the final result except if day 1 of the year
            // is a Monday (then %W returns 01).
            // We also need to subtract 1 if the day 1 of the year is
            // Friday-Sunday, so the resulting equation becomes:
            let idow = woy + (dow11 > 4 || dow11 <= 1 ? 0 : 1);
            if (idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4) {
                idow = 1;
            } else if (idow === 0) {
                idow = _formats.V(new Date('' + (d.getFullYear() - 1) + '/12/31'));
            }
            return _xPad(idow, 0);
        },
        w: 'getDay',
        W: function (d) {
          let doy = parseInt(_formats.j(d), 10);
          let rdow = 7 - _formats.u(d);
          let woy = parseInt((doy + rdow) / 7, 10);
          return _xPad(woy, 0, 10);
        },
        y: function (d) {
          return _xPad(d.getFullYear() % 100, 0);
        },
        Y: 'getFullYear',
        z: function (d) {
          let o = d.getTimezoneOffset();
          let H = _xPad(parseInt(Math.abs(o / 60), 10), 0);
          let M = _xPad(o % 60, 0);
          return (o > 0 ? '-' : '+') + H + M;
        },
        Z: function (d) {
          return d.toString().replace(/^.*\(([^)]+)\)$/, '$1');
        },
        '%': function (d) {
          return '%';
        }
    };

    let _date = (typeof timestamp === 'undefined')
        ? new Date()
        : (timestamp instanceof Date)
            ? new Date(timestamp)
            : new Date(timestamp * 1000);

    let _aggregates = {
        c: 'locale',
        D: '%m/%d/%y',
        F: '%y-%m-%d',
        h: '%b',
        n: '\n',
        r: 'locale',
        R: '%H:%M',
        t: '\t',
        T: '%H:%M:%S',
        x: 'locale',
        X: 'locale'
    };

    // First replace aggregates (run in a loop because an agg may be made up of other aggs)
    while (fmt.match(/%[cDFhnrRtTxX]/)) {
        fmt = fmt.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
            let f = _aggregates[m1];
            return (f === 'locale' ? lcTime[m1] : f);
        })
    }

    // Now replace formats - we need a closure so that the date object gets passed through
    let str = fmt.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, function (m0, m1) {
        let f = _formats[m1];
        if (typeof f === 'string') {
            return _date[f]();
        } else if (typeof f === 'function') {
            return f(_date);
        } else if (typeof f === 'object' && typeof f[0] === 'string') {
            return _xPad(_date[f[0]](), f[1]);
        } else {
            // Shouldn't reach here
            return m1;
        }
    });

    return str;
}

/*
    ----- Parse a time/date generated with strftime() -----
    //   example 1: strptime('20091112222135', '%Y%m%d%H%M%S') // Return value will depend on date and locale
    //   returns 1: {tm_sec: 35, tm_min: 21, tm_hour: 22, tm_mday: 12, tm_mon: 10, tm_year: 109, tm_wday: 4, tm_yday: 315, unparsed: ''}
    //   example 2: strptime('2009extra', '%Y')
    //   returns 2: {tm_sec:0, tm_min:0, tm_hour:0, tm_mday:0, tm_mon:0, tm_year:109, tm_wday:3, tm_yday: -1, unparsed: 'extra'}
*/
__DateTime.strptime = function (dateStr, format) {
    //var setlocale = require('../strings/setlocale')
    //var arrayMap = require('../array/array_map')
    let setlocale = __String.setlocale;
    let arrayMap = __Array.array_map;

    let retObj = {
        tm_sec: 0,
        tm_min: 0,
        tm_hour: 0,
        tm_mday: 0,
        tm_mon: 0,
        tm_year: 0,
        tm_wday: 0,
        tm_yday: 0,
        unparsed: ''
    };
    let i = 0;
    let j = 0;
    let amPmOffset = 0;
    let prevHour = false;
    let _reset = function (dateObj, realMday) {
        // realMday is to allow for a value of 0 in return results (but without
        // messing up the Date() object)
        let jan1;
        let o = retObj;
        let d = dateObj;
        o.tm_sec = d.getUTCSeconds();
        o.tm_min = d.getUTCMinutes();
        o.tm_hour = d.getUTCHours();
        o.tm_mday = realMday === 0 ? realMday : d.getUTCDate();
        o.tm_mon = d.getUTCMonth();
        o.tm_year = d.getUTCFullYear() - 1900;
        o.tm_wday = realMday === 0 ? (d.getUTCDay() > 0 ? d.getUTCDay() - 1 : 6) : d.getUTCDay();
        jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        o.tm_yday = Math.ceil((d - jan1) / (1000 * 60 * 60 * 24));
    };
    let _date = function () {
        let o = retObj;
        // We set date to at least 1 to ensure year or month doesn't go backwards
        return _reset(new Date(Date.UTC(
            o.tm_year + 1900,
            o.tm_mon,
            o.tm_mday || 1,
            o.tm_hour,
            o.tm_min,
            o.tm_sec
        )),
        o.tm_mday);
    };

    let _NWS = /\S/;
    let _WS = /\s/;

    let _aggregates = {
        c: 'locale',
        D: '%m/%d/%y',
        F: '%y-%m-%d',
        r: 'locale',
        R: '%H:%M',
        T: '%H:%M:%S',
        x: 'locale',
        X: 'locale'
    };

    /* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
        Ec
        EC
        Ex
        EX
        Ey
        EY
        Od or Oe
        OH
        OI
        Om
        OM
        OS
        OU
        Ow
        OW
        Oy
    */
    let _pregQuote = function (str) {
        return (str + '').replace(/([\\.+*?[^\]$(){}=!<>|:])/g, '\\$1');
    };

    // ensure setup of localization variables takes place
    setlocale('LC_ALL', 0);

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    let locale = $locutus.php.localeCategories.LC_TIME;
    let lcTime = $locutus.php.locales[locale].LC_TIME;

    // First replace aggregates (run in a loop because an agg may be made up of other aggs)
    while (format.match(/%[cDFhnrRtTxX]/)) {
        format = format.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
            let f = _aggregates[m1];
            return (f === 'locale' ? lcTime[m1] : f);
        })
    }

    let _addNext = function (j, regex, cb) {
        if (typeof regex === 'string') {
            regex = new RegExp('^' + regex, 'i');
        }
        let check = dateStr.slice(j);
        let match = regex.exec(check);
        // Even if the callback returns null after assigning to the
        // return object, the object won't be saved anyways
        let testNull = match ? cb.apply(null, match) : null;
        if (testNull === null) {
            throw new Error('No match in string');
        }
        return j + match[0].length;
    }

    let _addLocalized = function (j, formatChar, category) {
        // Could make each parenthesized instead and pass index to callback:
        return _addNext(j, arrayMap(_pregQuote, lcTime[formatChar]).join('|'),
            function (m) {
                let match = lcTime[formatChar].search(new RegExp('^' + _pregQuote(m) + '$', 'i'));
                if (match) {
                    retObj[category] = match[0];
                }
            }
        )
    };

    // BEGIN PROCESSING CHARACTERS
    for (i = 0, j = 0; i < format.length; i++) {
        if (format.charAt(i) === '%') {
            let literalPos = ['%', 'n', 't'].indexOf(format.charAt(i + 1));
            if (literalPos !== -1) {
                if (['%', '\n', '\t'].indexOf(dateStr.charAt(j)) === literalPos) {
                    // a matched literal
                    ++i;
                    // skip beyond
                    ++j;
                    continue;
                }
                // Format indicated a percent literal, but not actually present
                return false;
            }
            let formatChar = format.charAt(i + 1);
            try {
                switch (formatChar) {
                    case 'a':
                    case 'A':
                        // Sunday-Saturday
                        // Changes nothing else
                        j = _addLocalized(j, formatChar, 'tm_wday');
                        break;
                    case 'h':
                    case 'b':
                        // Jan-Dec
                        j = _addLocalized(j, 'b', 'tm_mon');
                        // Also changes wday, yday
                        _date();
                        break;
                    case 'B':
                        // January-December
                        j = _addLocalized(j, formatChar, 'tm_mon');
                        // Also changes wday, yday
                        _date();
                        break;
                    case 'C':
                        // 0+; century (19 for 20th)
                        // PHP docs say two-digit, but accepts one-digit (two-digit max):
                        j = _addNext(j, /^\d?\d/,
                            function (d) {
                                let year = (parseInt(d, 10) - 19) * 100;
                                retObj.tm_year = year;
                                _date();
                                if (!retObj.tm_yday) {
                                    retObj.tm_yday = -1;
                                }
                              // Also changes wday; and sets yday to -1 (always?)
                            }
                        );
                        break;
                    case 'd':
                    case 'e':
                        // 1-31 day
                        j = _addNext(j, formatChar === 'd'
                            ? /^(0[1-9]|[1-2]\d|3[0-1])/
                            : /^([1-2]\d|3[0-1]|[1-9])/,
                            function (d) {
                                var dayMonth = parseInt(d, 10)
                                retObj.tm_mday = dayMonth
                                // Also changes w_day, y_day
                                _date()
                            });
                        break;
                    case 'g':
                        // No apparent effect; 2-digit year (see 'V')
                        break;
                    case 'G':
                        // No apparent effect; 4-digit year (see 'V')'
                        break;
                    case 'H':
                        // 00-23 hours
                        j = _addNext(j, /^([0-1]\d|2[0-3])/, function (d) {
                            let hour = parseInt(d, 10)
                            retObj.tm_hour = hour
                            // Changes nothing else
                        });
                        break;
                    case 'l':
                    case 'I':
                        // 01-12 hours
                        j = _addNext(j, formatChar === 'l'
                            ? /^([1-9]|1[0-2])/
                            : /^(0[1-9]|1[0-2])/,
                            function (d) {
                                let hour = parseInt(d, 10) - 1 + amPmOffset;
                                retObj.tm_hour = hour;
                                // Used for coordinating with am-pm
                                prevHour = true;
                                // Changes nothing else, but affected by prior 'p/P'
                            }
                        );
                        break;
                    case 'j':
                        // 001-366 day of year
                        j = _addNext(j, /^(00[1-9]|0[1-9]\d|[1-2]\d\d|3[0-6][0-6])/, function (d) {
                            let dayYear = parseInt(d, 10) - 1;
                            retObj.tm_yday = dayYear;
                            // Changes nothing else
                            // (oddly, since if original by a given year, could calculate other fields)
                        });
                        break;
                    case 'm':
                        // 01-12 month
                        j = _addNext(j, /^(0[1-9]|1[0-2])/, function (d) {
                            let month = parseInt(d, 10) - 1;
                            retObj.tm_mon = month;
                            // Also sets wday and yday
                            _date();
                        });
                        break;
                    case 'M':
                        // 00-59 minutes
                        j = _addNext(j, /^[0-5]\d/, function (d) {
                            let minute = parseInt(d, 10);
                            retObj.tm_min = minute;
                            // Changes nothing else
                        });
                        break;
                    case 'P':
                        // Seems not to work; AM-PM
                        // Could make fall-through instead since supposed to be a synonym despite PHP docs
                        return false;
                    case 'p':
                        // am-pm
                        j = _addNext(j, /^(am|pm)/i, function (d) {
                            // No effect on 'H' since already 24 hours but
                            //   works before or after setting of l/I hour
                            amPmOffset = (/a/).test(d) ? 0 : 12;
                            if (prevHour) {
                                retObj.tm_hour += amPmOffset;
                            }
                        });
                        break;
                    case 's':
                        // Unix timestamp (in seconds)
                        j = _addNext(j, /^\d+/, function (d) {
                            let timestamp = parseInt(d, 10);
                            let date = new Date(Date.UTC(timestamp * 1000));
                            _reset(date);
                            // Affects all fields, but can't be negative (and initial + not allowed)
                        });
                        break;
                    case 'S':
                        // 00-59 seconds
                        j = _addNext(j, /^[0-5]\d/, function (d) {
                            let second = parseInt(d, 10);
                            retObj.tm_sec = second;
                            // Changes nothing else
                        });
                        break;
                    case 'u':
                    case 'w':
                        // 0 (Sunday)-6(Saturday)
                        j = _addNext(j, /^\d/, function (d) {
                          retObj.tm_wday = d - (formatChar === 'u');
                          // Changes nothing else apparently
                        });
                        break;
                    case 'U':
                    case 'V':
                    case 'W':
                        // Apparently ignored (week of year, from 1st Monday)
                        break;
                    case 'y':
                        // 69 (or higher) for 1969+, 68 (or lower) for 2068-
                         // PHP docs say two-digit, but accepts one-digit (two-digit max):
                        j = _addNext(j, /^\d?\d/, function (d) {
                            d = parseInt(d, 10);
                            let year = d >= 69 ? d : d + 100;
                            retObj.tm_year = year;
                            _date();
                            if (!retObj.tm_yday) {
                                retObj.tm_yday = -1;
                            }
                            // Also changes wday; and sets yday to -1 (always?)
                        });
                        break;
                    case 'Y':
                        // 2010 (4-digit year)
                        // PHP docs say four-digit, but accepts one-digit (four-digit max):
                        j = _addNext(j, /^\d{1,4}/, function (d) {
                            let year = (parseInt(d, 10)) - 1900;
                            retObj.tm_year = year;
                            _date();
                            if (!retObj.tm_yday) {
                                retObj.tm_yday = -1;;
                            }
                            // Also changes wday; and sets yday to -1 (always?)
                        });
                        break;
                    case 'z':
                        // Timezone; on my system, strftime gives -0800,
                        // but strptime seems not to alter hour setting
                        break;
                    case 'Z':
                        // Timezone; on my system, strftime gives PST, but strptime treats text as unparsed
                        break;
                    default:
                        throw new Error('Unrecognized formatting character in strptime()');
                }
            } catch (e) {
                if (e === 'No match in string') {
                    // Allow us to exit
                    // There was supposed to be a matching format but there wasn't
                    return false;
                }
                // Calculate skipping beyond initial percent too
            }
            ++i;
        } else if (format.charAt(i) !== dateStr.charAt(j)) {
            // If extra whitespace at beginning or end of either, or between formats, no problem
            // (just a problem when between % and format specifier)

            // If the string has white-space, it is ok to ignore
            if (dateStr.charAt(j).search(_WS) !== -1) {
                j++;
                // Let the next iteration try again with the same format character
                i--;
            } else if (format.charAt(i).search(_NWS) !== -1) {
                // Any extra formatting characters besides white-space causes
                // problems (do check after WS though, as may just be WS in string before next character)
                return false;
            }
            // Extra WS in format
            // Adjust strings when encounter non-matching whitespace, so they align in future checks above
            // Will check on next iteration (against same (non-WS) string character)
        } else {
            j++;
        }
    }

    // POST-PROCESSING
    // Will also get extra whitespace; empty string if none
    retObj.unparsed = dateStr.slice(j);
    return retObj;
}

/*
    ----- Returns the current time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 GMT). -----
    //   example 1: var $timeStamp = time()
    //   example 1: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
    //   returns 1: true
*/
__DateTime.time = function () {
  return Math.floor(new Date().getTime() / 1000);
}

/*
    ----- Parse about any English textual datetime description into a Unix timestamp -----
    //        example 1: strtotime('+1 day', 1129633200)
    //        returns 1: 1129719600
    //        example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
    //        returns 2: 1130425202
    //        example 3: strtotime('last month', 1129633200)
    //        returns 3: 1127041200
    //        example 4: strtotime('2009-05-04 08:30:00+00')
    //        returns 4: 1241425800
    //        example 5: strtotime('2009-05-04 08:30:00+02:00')
    //        returns 5: 1241418600
*/
__DateTime.strtotime = function (str, now) {
    //Parse about any English textual datetime description into a Unix timestamp
    const reSpace = '[ \\t]+';
    const reSpaceOpt = '[ \\t]*';
    const reMeridian = '(?:([ap])\\.?m\\.?([\\t ]|$))';
    const reHour24 = '(2[0-4]|[01]?[0-9])';
    const reHour24lz = '([01][0-9]|2[0-4])';
    const reHour12 = '(0?[1-9]|1[0-2])';
    const reMinute = '([0-5]?[0-9])';
    const reMinutelz = '([0-5][0-9])';
    const reSecond = '(60|[0-5]?[0-9])';
    const reSecondlz = '(60|[0-5][0-9])';
    const reFrac = '(?:\\.([0-9]+))';

    const reDayfull = 'sunday|monday|tuesday|wednesday|thursday|friday|saturday';
    const reDayabbr = 'sun|mon|tue|wed|thu|fri|sat';
    const reDaytext = reDayfull + '|' + reDayabbr + '|weekdays?';

    const reReltextnumber = 'first|second|third|fourth|fifth|sixth|seventh|eighth?|ninth|tenth|eleventh|twelfth';
    const reReltexttext = 'next|last|previous|this';
    const reReltextunit = '(?:second|sec|minute|min|hour|day|fortnight|forthnight|month|year)s?|weeks|' + reDaytext;

    const reYear = '([0-9]{1,4})';
    const reYear2 = '([0-9]{2})';
    const reYear4 = '([0-9]{4})';
    const reYear4withSign = '([+-]?[0-9]{4})';
    const reMonth = '(1[0-2]|0?[0-9])';
    const reMonthlz = '(0[0-9]|1[0-2])';
    const reDay = '(?:(3[01]|[0-2]?[0-9])(?:st|nd|rd|th)?)';
    const reDaylz = '(0[0-9]|[1-2][0-9]|3[01])';

    const reMonthFull = 'january|february|march|april|may|june|july|august|september|october|november|december';
    const reMonthAbbr = 'jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec';
    const reMonthroman = 'i[vx]|vi{0,3}|xi{0,2}|i{1,3}';
    const reMonthText = '(' + reMonthFull + '|' + reMonthAbbr + '|' + reMonthroman + ')';

    const reTzCorrection = '((?:GMT)?([+-])' + reHour24 + ':?' + reMinute + '?)';
    const reDayOfYear = '(00[1-9]|0[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6])';
    const reWeekOfYear = '(0[1-9]|[1-4][0-9]|5[0-3])';
    const formats = {
        yesterday: {
            regex: /^yesterday/i,
            name: 'yesterday',
            callback() {
                this.rd -= 1;
                return this.resetTime();
            }
        },
        now: {
            regex: /^now/i,
            name: 'now'
            // do nothing
        },
        noon: {
            regex: /^noon/i,
            name: 'noon',
            callback() {
                return this.resetTime() && this.time(12, 0, 0, 0);
            }
        },
        midnightOrToday: {
            regex: /^(midnight|today)/i,
            name: 'midnight | today',
            callback() {
                return this.resetTime();
            }
        },
        tomorrow: {
            regex: /^tomorrow/i,
            name: 'tomorrow',
            callback() {
                this.rd += 1
                return this.resetTime();
            }
        },
        timestamp: {
            regex: /^@(-?\d+)/i,
            name: 'timestamp',
            callback(match, timestamp) {
                this.rs += +timestamp;
                this.y = 1970;
                this.m = 0;
                this.d = 1;
                this.dates = 0;
                return this.resetTime() && this.zone(0);
            }
        },
        firstOrLastDay: {
            regex: /^(first|last) day of/i,
            name: 'firstdayof | lastdayof',
            callback(match, day) {
                if (day.toLowerCase() === 'first') {
                    this.firstOrLastDayOfMonth = 1;
                } else {
                    this.firstOrLastDayOfMonth = -1;
                }
            }
        },
        backOrFrontOf: {
            regex: RegExp('^(back|front) of ' + reHour24 + reSpaceOpt + reMeridian + '?', 'i'),
            name: 'backof | frontof',
            callback(match, side, hours, meridian) {
                let back = side.toLowerCase() === 'back';
                let hour = +hours;
                let minute = 15;

                if (!back) {
                    hour -= 1;
                    minute = 45;
                }
                hour = processMeridian(hour, meridian);
                return this.resetTime() && this.time(hour, minute, 0, 0);
            }
        },
        weekdayOf: {
            regex: RegExp('^(' + reReltextnumber + '|' + reReltexttext + ')' + reSpace + '(' + reDayfull + '|' + reDayabbr + ')' + reSpace + 'of', 'i'),
            name: 'weekdayof'
            // todo
        },
        mssqltime: {
            regex: RegExp('^' + reHour12 + ':' + reMinutelz + ':' + reSecondlz + '[:.]([0-9]+)' + reMeridian, 'i'),
            name: 'mssqltime',
            callback(match, hour, minute, second, frac, meridian) {
                return this.time(processMeridian(+hour, meridian), +minute, +second, +frac.substr(0, 3));
            }
        },
        timeLong12: {
            regex: RegExp('^' + reHour12 + '[:.]' + reMinute + '[:.]' + reSecondlz + reSpaceOpt + reMeridian, 'i'),
            name: 'timelong12',
            callback(match, hour, minute, second, meridian) {
                return this.time(processMeridian(+hour, meridian), +minute, +second, 0);
            }
        },
        timeShort12: {
            regex: RegExp('^' + reHour12 + '[:.]' + reMinutelz + reSpaceOpt + reMeridian, 'i'),
            name: 'timeshort12',
            callback(match, hour, minute, meridian) {
                return this.time(processMeridian(+hour, meridian), +minute, 0, 0);
            }
        },
        timeTiny12: {
            regex: RegExp('^' + reHour12 + reSpaceOpt + reMeridian, 'i'),
            name: 'timetiny12',
            callback(match, hour, meridian) {
                return this.time(processMeridian(+hour, meridian), 0, 0, 0);
            }
        },
        soap: {
            regex: RegExp('^' + reYear4 + '-' + reMonthlz + '-' + reDaylz + 'T' + reHour24lz + ':' + reMinutelz + ':' + reSecondlz + reFrac + reTzCorrection + '?', 'i'),
            name: 'soap',
            callback(match, year, month, day, hour, minute, second, frac, tzCorrection) {
                return this.ymd(+year, month - 1, +day) &&
                    this.time(+hour, +minute, +second, +frac.substr(0, 3)) &&
                    this.zone(processTzCorrection(tzCorrection));
            }
        },
        wddx: {
            regex: RegExp('^' + reYear4 + '-' + reMonth + '-' + reDay + 'T' + reHour24 + ':' + reMinute + ':' + reSecond),
            name: 'wddx',
            callback(match, year, month, day, hour, minute, second) {
                return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0);
            }
        },
        exif: {
            regex: RegExp('^' + reYear4 + ':' + reMonthlz + ':' + reDaylz + ' ' + reHour24lz + ':' + reMinutelz + ':' + reSecondlz, 'i'),
            name: 'exif',
            callback(match, year, month, day, hour, minute, second) {
                return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0);
            }
        },
        xmlRpc: {
            regex: RegExp('^' + reYear4 + reMonthlz + reDaylz + 'T' + reHour24 + ':' + reMinutelz + ':' + reSecondlz),
            name: 'xmlrpc',
            callback(match, year, month, day, hour, minute, second) {
                return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0);
            }
        },
        xmlRpcNoColon: {
            regex: RegExp('^' + reYear4 + reMonthlz + reDaylz + '[Tt]' + reHour24 + reMinutelz + reSecondlz),
            name: 'xmlrpcnocolon',
            callback(match, year, month, day, hour, minute, second) {
                return this.ymd(+year, month - 1, +day) && this.time(+hour, +minute, +second, 0);
            }
        },
        clf: {
            regex: RegExp('^' + reDay + '/(' + reMonthAbbr + ')/' + reYear4 + ':' + reHour24lz + ':' + reMinutelz + ':' + reSecondlz + reSpace + reTzCorrection, 'i'),
            name: 'clf',
            callback(match, day, month, year, hour, minute, second, tzCorrection) {
                return this.ymd(+year, lookupMonth(month), +day) &&
                    this.time(+hour, +minute, +second, 0) &&
                    this.zone(processTzCorrection(tzCorrection));
            }
        },
        iso8601long: {
            regex: RegExp('^t?' + reHour24 + '[:.]' + reMinute + '[:.]' + reSecond + reFrac, 'i'),
            name: 'iso8601long',
            callback(match, hour, minute, second, frac) {
                return this.time(+hour, +minute, +second, +frac.substr(0, 3));
            }
        },
        dateTextual: {
            regex: RegExp('^' + reMonthText + '[ .\\t-]*' + reDay + '[,.stndrh\\t ]+' + reYear, 'i'),
            name: 'datetextual',
            callback(match, month, day, year) {
                return this.ymd(processYear(year), lookupMonth(month), +day);
            }
        },
        pointedDate4: {
            regex: RegExp('^' + reDay + '[.\\t-]' + reMonth + '[.-]' + reYear4),
            name: 'pointeddate4',
            callback(match, day, month, year) {
                return this.ymd(+year, month - 1, +day);
            }
        },
        pointedDate2: {
            regex: RegExp('^' + reDay + '[.\\t]' + reMonth + '\\.' + reYear2),
            name: 'pointeddate2',
            callback(match, day, month, year) {
                return this.ymd(processYear(year), month - 1, +day);
            }
        },
        timeLong24: {
            regex: RegExp('^t?' + reHour24 + '[:.]' + reMinute + '[:.]' + reSecond),
            name: 'timelong24',
            callback(match, hour, minute, second) {
                return this.time(+hour, +minute, +second, 0);
            }
        },
        dateNoColon: {
            regex: RegExp('^' + reYear4 + reMonthlz + reDaylz),
            name: 'datenocolon',
            callback(match, year, month, day) {
                return this.ymd(+year, month - 1, +day);
            }
        },
        pgydotd: {
            regex: RegExp('^' + reYear4 + '\\.?' + reDayOfYear),
            name: 'pgydotd',
            callback(match, year, day) {
                return this.ymd(+year, 0, +day);
            }
        },
        timeShort24: {
            regex: RegExp('^t?' + reHour24 + '[:.]' + reMinute, 'i'),
            name: 'timeshort24',
            callback(match, hour, minute) {
                return this.time(+hour, +minute, 0, 0);
            }
        },
        iso8601noColon: {
            regex: RegExp('^t?' + reHour24lz + reMinutelz + reSecondlz, 'i'),
            name: 'iso8601nocolon',
            callback(match, hour, minute, second) {
                return this.time(+hour, +minute, +second, 0);
            }
        },
        iso8601dateSlash: {
            // eventhough the trailing slash is optional in PHP
            // here it's mandatory and inputs without the slash
            // are handled by dateslash
            regex: RegExp('^' + reYear4 + '/' + reMonthlz + '/' + reDaylz + '/'),
            name: 'iso8601dateslash',
            callback(match, year, month, day) {
                return this.ymd(+year, month - 1, +day);
            }
        },
        dateSlash: {
            regex: RegExp('^' + reYear4 + '/' + reMonth + '/' + reDay),
            name: 'dateslash',
            callback(match, year, month, day) {
                return this.ymd(+year, month - 1, +day);
            }
        },
        american: {
            regex: RegExp('^' + reMonth + '/' + reDay + '/' + reYear),
            name: 'american',
            callback(match, month, day, year) {
                return this.ymd(processYear(year), month - 1, +day);
            }
        },
        americanShort: {
            regex: RegExp('^' + reMonth + '/' + reDay),
            name: 'americanshort',
            callback(match, month, day) {
                return this.ymd(this.y, month - 1, +day);
            }
        },
        gnuDateShortOrIso8601date2: {
            // iso8601date2 is complete subset of gnudateshort
            regex: RegExp('^' + reYear + '-' + reMonth + '-' + reDay),
            name: 'gnudateshort | iso8601date2',
            callback(match, year, month, day) {
                return this.ymd(processYear(year), month - 1, +day);
            }
        },
        iso8601date4: {
            regex: RegExp('^' + reYear4withSign + '-' + reMonthlz + '-' + reDaylz),
            name: 'iso8601date4',
            callback(match, year, month, day) {
                return this.ymd(+year, month - 1, +day);
            }
        },
        gnuNoColon: {
            regex: RegExp('^t' + reHour24lz + reMinutelz, 'i'),
            name: 'gnunocolon',
            callback(match, hour, minute) {
                return this.time(+hour, +minute, 0, this.f);
            }
        },
        gnuDateShorter: {
            regex: RegExp('^' + reYear4 + '-' + reMonth),
            name: 'gnudateshorter',
            callback(match, year, month) {
                return this.ymd(+year, month - 1, 1);
            }
        },
        pgTextReverse: {
            // note: allowed years are from 32-9999
            // years below 32 should be treated as days in datefull
            regex: RegExp('^' + '(\\d{3,4}|[4-9]\\d|3[2-9])-(' + reMonthAbbr + ')-' + reDaylz, 'i'),
            name: 'pgtextreverse',
            callback(match, year, month, day) {
                return this.ymd(processYear(year), lookupMonth(month), +day);
            }
        },
        dateFull: {
            regex: RegExp('^' + reDay + '[ \\t.-]*' + reMonthText + '[ \\t.-]*' + reYear, 'i'),
            name: 'datefull',
            callback(match, day, month, year) {
                return this.ymd(processYear(year), lookupMonth(month), +day);
            }
        },
        dateNoDay: {
            regex: RegExp('^' + reMonthText + '[ .\\t-]*' + reYear4, 'i'),
            name: 'datenoday',
            callback(match, month, year) {
                return this.ymd(+year, lookupMonth(month), 1);
            }
        },
        dateNoDayRev: {
            regex: RegExp('^' + reYear4 + '[ .\\t-]*' + reMonthText, 'i'),
            name: 'datenodayrev',
            callback(match, year, month) {
                return this.ymd(+year, lookupMonth(month), 1);
            }
        },
        pgTextShort: {
            regex: RegExp('^(' + reMonthAbbr + ')-' + reDaylz + '-' + reYear, 'i'),
            name: 'pgtextshort',
            callback(match, month, day, year) {
                return this.ymd(processYear(year), lookupMonth(month), +day);
            }
        },
        dateNoYear: {
            regex: RegExp('^' + reMonthText + '[ .\\t-]*' + reDay + '[,.stndrh\\t ]*', 'i'),
            name: 'datenoyear',
            callback(match, month, day) {
                return this.ymd(this.y, lookupMonth(month), +day);
            }
        },
        dateNoYearRev: {
            regex: RegExp('^' + reDay + '[ .\\t-]*' + reMonthText, 'i'),
            name: 'datenoyearrev',
            callback(match, day, month) {
                return this.ymd(this.y, lookupMonth(month), +day);
            }
        },
        isoWeekDay: {
            regex: RegExp('^' + reYear4 + '-?W' + reWeekOfYear + '(?:-?([0-7]))?'),
            name: 'isoweekday | isoweek',
            callback(match, year, week, day) {
                day = day ? +day : 1;

                if (!this.ymd(+year, 0, 1)) {
                    return false;
                }

                // get day of week for Jan 1st
                let dayOfWeek = new Date(this.y, this.m, this.d).getDay();

                // and use the day to figure out the offset for day 1 of week 1
                dayOfWeek = 0 - (dayOfWeek > 4 ? dayOfWeek - 7 : dayOfWeek);

                this.rd += dayOfWeek + ((week - 1) * 7) + day;
            }
        },
        relativeText: {
            regex: RegExp('^(' + reReltextnumber + '|' + reReltexttext + ')' + reSpace + '(' + reReltextunit + ')', 'i'),
            name: 'relativetext',
            callback(match, relValue, relUnit) {
                // todo: implement handling of 'this time-unit'
                // eslint-disable-next-line no-unused-vars
                const { amount, behavior } = lookupRelative(relValue);

                switch (relUnit.toLowerCase()) {
                    case 'sec':
                    case 'secs':
                    case 'second':
                    case 'seconds':
                        this.rs += amount;
                        break;
                    case 'min':
                    case 'mins':
                    case 'minute':
                    case 'minutes':
                        this.ri += amount;
                        break;
                    case 'hour':
                    case 'hours':
                        this.rh += amount;
                        break;
                    case 'day':
                    case 'days':
                        this.rd += amount;
                        break;
                    case 'fortnight':
                    case 'fortnights':
                    case 'forthnight':
                    case 'forthnights':
                        this.rd += amount * 14;
                        break;
                    case 'week':
                    case 'weeks':
                        this.rd += amount * 7;
                        break;
                    case 'month':
                    case 'months':
                        this.rm += amount;
                        break;
                    case 'year':
                    case 'years':
                        this.ry += amount;
                        break;
                    case 'mon': case 'monday':
                    case 'tue': case 'tuesday':
                    case 'wed': case 'wednesday':
                    case 'thu': case 'thursday':
                    case 'fri': case 'friday':
                    case 'sat': case 'saturday':
                    case 'sun': case 'sunday':
                        this.resetTime();
                        this.weekday = lookupWeekday(relUnit, 7);
                        this.weekdayBehavior = 1;
                        this.rd += (amount > 0 ? amount - 1 : amount) * 7;
                        break;
                    case 'weekday':
                    case 'weekdays':
                        // todo
                        break;
                }
            }
        },
        relative: {
            regex: RegExp('^([+-]*)[ \\t]*(\\d+)' + reSpaceOpt + '(' + reReltextunit + '|week)', 'i'),
            name: 'relative',
            callback(match, signs, relValue, relUnit) {
                const minuses = signs.replace(/[^-]/g, '').length;

                let amount = +relValue * Math.pow(-1, minuses);

                switch (relUnit.toLowerCase()) {
                    case 'sec':
                    case 'secs':
                    case 'second':
                    case 'seconds':
                        this.rs += amount;
                        break;
                    case 'min':
                    case 'mins':
                    case 'minute':
                    case 'minutes':
                        this.ri += amount;
                        break;
                    case 'hour':
                    case 'hours':
                        this.rh += amount;
                        break;
                    case 'day':
                    case 'days':
                        this.rd += amount;
                        break;
                    case 'fortnight':
                    case 'fortnights':
                    case 'forthnight':
                    case 'forthnights':
                        this.rd += amount * 14;
                        break;
                    case 'week':
                    case 'weeks':
                        this.rd += amount * 7;
                        break;
                    case 'month':
                    case 'months':
                        this.rm += amount;
                        break;
                    case 'year':
                    case 'years':
                        this.ry += amount;
                        break;
                    case 'mon': case 'monday':
                    case 'tue': case 'tuesday':
                    case 'wed': case 'wednesday':
                    case 'thu': case 'thursday':
                    case 'fri': case 'friday':
                    case 'sat': case 'saturday':
                    case 'sun': case 'sunday':
                        this.resetTime();
                        this.weekday = lookupWeekday(relUnit, 7);
                        this.weekdayBehavior = 1;
                        this.rd += (amount > 0 ? amount - 1 : amount) * 7;
                        break;
                    case 'weekday':
                    case 'weekdays':
                        // todo
                        break;
                }
            }
        },
        dayText: {
            regex: RegExp('^(' + reDaytext + ')', 'i'),
            name: 'daytext',
            callback(match, dayText) {
                this.resetTime();
                this.weekday = lookupWeekday(dayText, 0);

                if (this.weekdayBehavior !== 2) {
                    this.weekdayBehavior = 1;
                }
            }
        },
        relativeTextWeek: {
            regex: RegExp('^(' + reReltexttext + ')' + reSpace + 'week', 'i'),
            name: 'relativetextweek',
            callback(match, relText) {
                this.weekdayBehavior = 2;

                switch (relText.toLowerCase()) {
                    case 'this':
                        this.rd += 0;
                        break;
                    case 'next':
                        this.rd += 7;
                        break;
                    case 'last':
                    case 'previous':
                        this.rd -= 7;
                        break;
                }

                if (isNaN(this.weekday)) {
                    this.weekday = 1;
                }
            }
        },
        monthFullOrMonthAbbr: {
            regex: RegExp('^(' + reMonthFull + '|' + reMonthAbbr + ')', 'i'),
            name: 'monthfull | monthabbr',
            callback(match, month) {
                return this.ymd(this.y, lookupMonth(month), this.d);
            }
        },
        tzCorrection: {
            regex: RegExp('^' + reTzCorrection, 'i'),
            name: 'tzcorrection',
            callback(tzCorrection) {
                return this.zone(processTzCorrection(tzCorrection));
            }
        },
        ago: {
            regex: /^ago/i,
            name: 'ago',
            callback() {
                this.ry = -this.ry;
                this.rm = -this.rm;
                this.rd = -this.rd;
                this.rh = -this.rh;
                this.ri = -this.ri;
                this.rs = -this.rs;
                this.rf = -this.rf;
            }
        },
        gnuNoColon2: {
            // second instance of gnunocolon, without leading 't'
            // it's down here, because it is very generic (4 digits in a row)
            // thus conflicts with many rules above
            // only year4 should come afterwards
            regex: RegExp('^' + reHour24lz + reMinutelz, 'i'),
            name: 'gnunocolon',
            callback(match, hour, minute) {
                return this.time(+hour, +minute, 0, this.f);
            }
        },
        year4: {
            regex: RegExp('^' + reYear4),
            name: 'year4',
            callback(match, year) {
                this.y = +year;
                return true;
            }
        },
        whitespace: {
            regex: /^[ .,\t]+/,
            name: 'whitespace'
            // do nothing
        },
        any: {
            regex: /^[\s\S]+/,
            name: 'any',
            callback() {
                return false;
            }
        }
    };

    let resultProto = {
        // date
        y: NaN,
        m: NaN,
        d: NaN,
        // time
        h: NaN,
        i: NaN,
        s: NaN,
        f: NaN,

        // relative shifts
        ry: 0,
        rm: 0,
        rd: 0,
        rh: 0,
        ri: 0,
        rs: 0,
        rf: 0,

        // weekday related shifts
        weekday: NaN,
        weekdayBehavior: 0,

        // first or last day of month
        // 0 none, 1 first, -1 last
        firstOrLastDayOfMonth: 0,

        // timezone correction in minutes
        z: NaN,

        // counters
        dates: 0,
        times: 0,
        zones: 0,

        // helper functions
        ymd(y, m, d) {
            if (this.dates > 0) {
                return false;
            }

            this.dates++;
            this.y = y;
            this.m = m;
            this.d = d;
            return true;
        },

        time(h, i, s, f) {
            if (this.times > 0) {
                return false;
            }

            this.times++;
            this.h = h;
            this.i = i;
            this.s = s;
            this.f = f;
            return true;
        },

        resetTime() {
            this.h = 0;
            this.i = 0;
            this.s = 0;
            this.f = 0;
            this.times = 0;

            return true;
        },

        zone(minutes) {
            if (this.zones <= 1) {
                this.zones++;
                this.z = minutes;
                return true;
            }

            return false;
        },

        toDate(relativeTo) {
            if (this.dates && !this.times) {
                this.h = this.i = this.s = this.f = 0;
            }

            // fill holes
            if (isNaN(this.y)) {
                this.y = relativeTo.getFullYear();
            }

            if (isNaN(this.m)) {
                this.m = relativeTo.getMonth();
            }

            if (isNaN(this.d)) {
                this.d = relativeTo.getDate();
            }

            if (isNaN(this.h)) {
                this.h = relativeTo.getHours();
            }

            if (isNaN(this.i)) {
                this.i = relativeTo.getMinutes();
            }

            if (isNaN(this.s)) {
                this.s = relativeTo.getSeconds();
            }

            if (isNaN(this.f)) {
                this.f = relativeTo.getMilliseconds();
            }

            // adjust special early
            switch (this.firstOrLastDayOfMonth) {
                case 1:
                    this.d = 1;
                    break;
                case -1:
                    this.d = 0;
                    this.m += 1;
                    break;
            }

            if (!isNaN(this.weekday)) {
                var date = new Date(relativeTo.getTime());
                date.setFullYear(this.y, this.m, this.d);
                date.setHours(this.h, this.i, this.s, this.f);

                var dow = date.getDay();

                if (this.weekdayBehavior === 2) {
                    // To make "this week" work, where the current day of week is a "sunday"
                    if (dow === 0 && this.weekday !== 0) {
                        this.weekday = -6;
                    }

                    // To make "sunday this week" work, where the current day of week is not a "sunday"
                    if (this.weekday === 0 && dow !== 0) {
                        this.weekday = 7;
                    }

                    this.d -= dow;
                    this.d += this.weekday;
                } else {
                    var diff = this.weekday - dow;

                    // some PHP magic
                    if ((this.rd < 0 && diff < 0) || (this.rd >= 0 && diff <= -this.weekdayBehavior)) {
                        diff += 7;
                    }

                    if (this.weekday >= 0) {
                        this.d += diff;
                    } else {
                        this.d -= (7 - (Math.abs(this.weekday) - dow));
                    }

                    this.weekday = NaN;
                }
            }

            // adjust relative
            this.y += this.ry;
            this.m += this.rm;
            this.d += this.rd;

            this.h += this.rh;
            this.i += this.ri;
            this.s += this.rs;
            this.f += this.rf;

            this.ry = this.rm = this.rd = 0;
            this.rh = this.ri = this.rs = this.rf = 0;

            let result = new Date(relativeTo.getTime());
            // since Date constructor treats years <= 99 as 1900+
            // it can't be used, thus this weird way
            result.setFullYear(this.y, this.m, this.d);
            result.setHours(this.h, this.i, this.s, this.f);

            // note: this is done twice in PHP
            // early when processing special relatives
            // and late
            // todo: check if the logic can be reduced
            // to just one time action
            switch (this.firstOrLastDayOfMonth) {
                case 1:
                    result.setDate(1);
                    break;
                case -1:
                    result.setMonth(result.getMonth() + 1, 0);
                    break;
            }

            // adjust timezone
            if (!isNaN(this.z) && result.getTimezoneOffset() !== this.z) {
                result.setUTCFullYear(
                    result.getFullYear(),
                    result.getMonth(),
                    result.getDate());

                result.setUTCHours(
                    result.getHours(),
                    result.getMinutes() + this.z,
                    result.getSeconds(),
                    result.getMilliseconds()
                );
            }

            return result;
        }
    };

    function processMeridian(hour, meridian) {
        meridian = meridian && meridian.toLowerCase();
        switch (meridian) {
            case 'a':
                hour += hour === 12 ? -12 : 0;
                break;
            case 'p':
                hour += hour !== 12 ? 12 : 0;
                break;
        }
        return hour;
    }

    function processYear(yearStr) {
        let year = +yearStr;
        if (yearStr.length < 4 && year < 100) {
            year += year < 70 ? 2000 : 1900;
        }
        return year;
    }

    function lookupMonth(monthStr) {
        return {
            jan: 0,
            january: 0,
            i: 0,
            feb: 1,
            february: 1,
            ii: 1,
            mar: 2,
            march: 2,
            iii: 2,
            apr: 3,
            april: 3,
            iv: 3,
            may: 4,
            v: 4,
            jun: 5,
            june: 5,
            vi: 5,
            jul: 6,
            july: 6,
            vii: 6,
            aug: 7,
            august: 7,
            viii: 7,
            sep: 8,
            sept: 8,
            september: 8,
            ix: 8,
            oct: 9,
            october: 9,
            x: 9,
            nov: 10,
            november: 10,
            xi: 10,
            dec: 11,
            december: 11,
            xii: 11
        }
        [monthStr.toLowerCase()];
    }

    function lookupWeekday(dayStr, desiredSundayNumber = 0) {
        const dayNumbers = {
            mon: 1,
            monday: 1,
            tue: 2,
            tuesday: 2,
            wed: 3,
            wednesday: 3,
            thu: 4,
            thursday: 4,
            fri: 5,
            friday: 5,
            sat: 6,
            saturday: 6,
            sun: 0,
            sunday: 0
        };
        return dayNumbers[dayStr.toLowerCase()] || desiredSundayNumber;
    }

    function lookupRelative(relText) {
        const relativeNumbers = {
            last: -1,
            previous: -1,
            this: 0,
            first: 1,
            next: 1,
            second: 2,
            third: 3,
            fourth: 4,
            fifth: 5,
            sixth: 6,
            seventh: 7,
            eight: 8,
            eighth: 8,
            ninth: 9,
            tenth: 10,
            eleventh: 11,
            twelfth: 12
        };

        const relativeBehavior = {
            this: 1
        };

        const relTextLower = relText.toLowerCase();

        return {
            amount: relativeNumbers[relTextLower],
            behavior: relativeBehavior[relTextLower] || 0
        };
    }

    function processTzCorrection(tzOffset, oldValue) {
        const reTzCorrectionLoose = /(?:GMT)?([+-])(\d+)(:?)(\d{0,2})/i;
        tzOffset = tzOffset && tzOffset.match(reTzCorrectionLoose);

        if (!tzOffset) {
            return oldValue;
        }

        let sign = tzOffset[1] === '-' ? 1 : -1;
        let hours = +tzOffset[2];
        let minutes = +tzOffset[4];

        if (!tzOffset[4] && !tzOffset[3]) {
            minutes = Math.floor(hours % 100);
            hours = Math.floor(hours / 100);
        }

        return sign * (hours * 60 + minutes);
    }

    if (now == null) {
        now = Math.floor(Date.now() / 1000);
    }

    // the rule order is very fragile
    // as many formats are similar to others
    // so small change can cause
    // input misinterpretation
    const rules = [
        formats.yesterday,
        formats.now,
        formats.noon,
        formats.midnightOrToday,
        formats.tomorrow,
        formats.timestamp,
        formats.firstOrLastDay,
        formats.backOrFrontOf,
        // formats.weekdayOf, // not yet implemented
        formats.mssqltime,
        formats.timeLong12,
        formats.timeShort12,
        formats.timeTiny12,
        formats.soap,
        formats.wddx,
        formats.exif,
        formats.xmlRpc,
        formats.xmlRpcNoColon,
        formats.clf,
        formats.iso8601long,
        formats.dateTextual,
        formats.pointedDate4,
        formats.pointedDate2,
        formats.timeLong24,
        formats.dateNoColon,
        formats.pgydotd,
        formats.timeShort24,
        formats.iso8601noColon,
        // iso8601dateSlash needs to come before dateSlash
        formats.iso8601dateSlash,
        formats.dateSlash,
        formats.american,
        formats.americanShort,
        formats.gnuDateShortOrIso8601date2,
        formats.iso8601date4,
        formats.gnuNoColon,
        formats.gnuDateShorter,
        formats.pgTextReverse,
        formats.dateFull,
        formats.dateNoDay,
        formats.dateNoDayRev,
        formats.pgTextShort,
        formats.dateNoYear,
        formats.dateNoYearRev,
        formats.isoWeekDay,
        formats.relativeText,
        formats.relative,
        formats.dayText,
        formats.relativeTextWeek,
        formats.monthFullOrMonthAbbr,
        formats.tzCorrection,
        formats.ago,
        formats.gnuNoColon2,
        formats.year4,
        // note: the two rules below
        // should always come last
        formats.whitespace,
        formats.any
    ];

    let result = Object.create(resultProto);
    
    while (str.length) {
        for (let i = 0, l = rules.length; i < l; i++) {
            const format = rules[i];
            const match = str.match(format.regex);
            if (match) {
                // care only about false results. Ignore other values
                if (format.callback && format.callback.apply(result, match) === false) {
                    return false;
                }
                str = str.substr(match[0].length);
                break;
            }
        }
    }
    return Math.floor(result.toDate(new Date(now * 1000)) / 1000);
}

/* -------------------------------------------------------- END DATE TIME -------------------------------------------------------- */



__._date_time = __DateTime;



/* -------------------------------------------------------- VAR -------------------------------------------------------- */
var __Var = {};

/*
    ----- Dumps information about a variable -----
    //   example 1: var_dump(1)
    //   returns 1: 'int(1)'
*/
__Var.var_dump = function () {
    //var echo = require('../strings/echo')
    let echo = __String.echo;
    let output = '';
    let padChar = ' ';
    let padVal = 4;
    let lgth = 0;
    let i = 0;

    let _getFuncName = function (fn) {
        let name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn);
        if (!name) {
          return '(Anonymous)';
        }
        return name[1];
    };

    let _repeatChar = function (len, padChar) {
        let str = '';
        for (let i = 0; i < len; i++) {
          str += padChar;
        }
        return str;
    };

    let _getInnerVal = function (val, thickPad) {
        let ret = '';
        if (val === null) {
            ret = 'NULL';
        } else if (typeof val === 'boolean') {
            ret = 'bool(' + val + ')';
        } else if (typeof val === 'string') {
            ret = 'string(' + val.length + ') "' + val + '"';
        } else if (typeof val === 'number') {
            if (parseFloat(val) === parseInt(val, 10)) {
                ret = 'int(' + val + ')';
            } else {
                ret = 'float(' + val + ')';
            }
        } else if (typeof val === 'undefined') {
            // The remaining are not PHP behavior because these values
            // only exist in this exact form in JavaScript
            ret = 'undefined';
        } else if (typeof val === 'function') {
            let funcLines = val.toString().split('\n');
            ret = '';
            for (let i = 0, fll = funcLines.length; i < fll; i++) {
                ret += (i !== 0 ? '\n' + thickPad : '') + funcLines[i];
            }
        } else if (val instanceof Date) {
            ret = 'Date(' + val + ')';
        } else if (val instanceof RegExp) {
            ret = 'RegExp(' + val + ')';
        } else if (val.nodeName) {
            // Different than PHP's DOMElement
            switch (val.nodeType) {
                case 1:
                    if (typeof val.namespaceURI === 'undefined' ||
                        val.namespaceURI === 'http://www.w3.org/1999/xhtml') 
                    {
                        // Undefined namespace could be plain XML, but namespaceURI not widely supported
                        ret = 'HTMLElement("' + val.nodeName + '")';
                    } else {
                        ret = 'XML Element("' + val.nodeName + '")';
                    }
                    break;
                case 2:
                    ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')';
                    break;
                case 3:
                    ret = 'TEXT_NODE(' + val.nodeValue + ')';
                    break;
                case 4:
                    ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')';
                    break;
                case 5:
                    ret = 'ENTITY_REFERENCE_NODE';
                    break;
                case 6:
                    ret = 'ENTITY_NODE';
                    break;
                case 7:
                    ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')';
                    break;
                case 8:
                    ret = 'COMMENT_NODE(' + val.nodeValue + ')';
                    break;
                case 9:
                    ret = 'DOCUMENT_NODE';
                    break;
                case 10:
                    ret = 'DOCUMENT_TYPE_NODE';
                    break;
                case 11:
                    ret = 'DOCUMENT_FRAGMENT_NODE';
                    break;
                case 12:
                    ret = 'NOTATION_NODE';
                    break;
            }
        }
        return ret;
    }

    let _formatArray = function (obj, curDepth, padVal, padChar) {
        if (curDepth > 0) {
            curDepth++;
        }

        let basePad = _repeatChar(padVal * (curDepth - 1), padChar);
        let thickPad = _repeatChar(padVal * (curDepth + 1), padChar);
        let str = '';
        let val = '';

        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor && _getFuncName(obj.constructor) === 'LOCUTUS_Resource') {
                return obj.var_dump();
            }

            lgth = 0;

            for (let someProp in obj) {
                if (obj.hasOwnProperty(someProp)) {
                    lgth++;
                }
            }

            str += 'array(' + lgth + ') {\n';

            for (let key in obj) {
                let objVal = obj[key];
                if (typeof objVal === 'object' &&
                    objVal !== null &&
                    !(objVal instanceof Date) &&
                    !(objVal instanceof RegExp) &&
                    !objVal.nodeName) 
                {
                    str += thickPad;
                    str += '[';
                    str += key;
                    str += '] =>\n';
                    str += thickPad;
                    str += _formatArray(objVal, curDepth + 1, padVal, padChar);
                } else {
                    val = _getInnerVal(objVal, thickPad);
                    str += thickPad;
                    str += '[';
                    str += key;
                    str += '] =>\n';
                    str += thickPad;
                    str += val;
                    str += '\n';
                }
            }
            str += basePad + '}\n';
        } else {
            str = _getInnerVal(obj, thickPad);
        }
        return str;
    }

    output = _formatArray(arguments[0], 0, padVal, padChar);
    for (i = 1; i < arguments.length; i++) {
        output += '\n' + _formatArray(arguments[i], 0, padVal, padChar);
    }

    echo(output);

    // Not how PHP does it, but helps us test:
    return output;
}

/*
    ----- Find whether the type of a variable is integer -----
    //   example 1: is_int(23)
    //   returns 1: true
    //   example 2: is_int('23')
    //   returns 2: false
    //   example 3: is_int(23.5)
    //   returns 3: false
    //   example 4: is_int(true)
    //   returns 4: false
*/
__Var.is_int = function (mixedVar) {
    return mixedVar === +mixedVar && isFinite(mixedVar) && !(mixedVar % 1);
}

/* -------------------------------------------------------- END VAR -------------------------------------------------------- */



__._var = __Var;



/* Console.log function */
function dd() {
    let arg = arguments;
    for (let i = 0; i < arg.length; i++) {
        __._var.var_dump(arg[i]);
    }
}

function cl(e) {
    let arg = arguments;
    for (let i = 0; i < arg.length; i++) {
        console.log(arg[i]);
    }
}

/* Check condition test */
function checkConditionTest(listCheckData) {
    cl(listCheckData);
    let checkResult = 0;
    let errFunction = [];
    for (let i = listCheckData.length - 1; i >= 0; i--) {
        listCheckData[i][0] !== listCheckData[i][1] ? errFunction.push("function - {0} of list function \"dataCheck\": data Accept is \"{1}\"".format(i, listCheckData[i][1])) : checkResult++;
    }
    return checkResult === listCheckData.length ? true : errFunction;
}

/* Format function */
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp("\\{" + i + "\\}", "gi");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


