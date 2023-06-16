import React from 'react';

import { clsx } from 'clsx';

export const Logo = ({ className, ...props }: React.ComponentPropsWithoutRef<'svg'>) => (
  <svg
    className={clsx('fill-sky-900 dark:fill-sky-600', className)}
    height="1388"
    version="1"
    viewBox="0 0 1287 1041"
    width="1716"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6125 10399c-474-24-955-106-1425-242-85-25-227-64-315-87-646-167-1131-336-1540-535-260-127-635-371-920-599-440-351-842-790-1130-1231C351 7025 67 6230 9 5505c-10-117-9-166 5-297 111-1072 563-1791 1396-2217 272-140 585-246 1068-364l93-22 43-101c161-373 474-746 804-958 255-163 497-249 799-282 136-15 178-16 322-6 92 7 217 23 281 37 63 13 196 40 295 60 790 155 1258 286 1907 531 399 151 603 223 707 250 236 62 343 47 1161-160 822-208 1303-302 1783-350l138-14 101 30c295 85 579 226 819 406 455 340 770 880 880 1505 22 129 43 375 36 435-4 36 4 61 49 162 96 216 146 411 165 645 33 417-101 919-357 1331-42 68-45 76-59 200-60 519-242 950-550 1303-43 50-115 121-158 158-75 65-81 73-155 218-212 415-495 733-882 990-139 93-353 205-475 250-75 26-86 35-164 118-318 335-787 590-1344 727-261 64-579 110-762 110-54 0-103 8-174 29-455 135-1083 200-1656 170zm230-983c374-19 761-165 1102-416 165-123 398-371 513-548 15-23 17-23 100-13 583 74 1161-185 1487-666 156-230 236-445 266-714l12-112 114-38c62-21 177-69 254-107 640-313 1069-902 1173-1608 23-156 23-466 0-613-60-388-209-722-457-1031-87-108-237-255-337-330-37-28-80-68-95-88-94-125-249-245-389-301-166-66 39-62-2983-59l-2740 3-115 32c-147 40-263 89-387 164-54 32-101 59-105 59s-53 27-107 59c-516 306-872 803-997 1391-22 107-27 158-31 349-6 255 4 373 48 551 177 725 682 1282 1390 1532 13 5 14 16 3 89-81 548 65 1118 404 1576 89 120 335 362 452 445 264 186 529 302 830 363 129 26 350 45 450 38 25-1 90-5 145-7z"
      transform="matrix(.1 0 0 -.1 0 1041)"
    ></path>
    <path
      d="M6598 8073c-157-252-285-459-283-461 3-3 1138-3 1140 1 1 1-124 202-277 447s-282 451-286 458c-5 8-108-147-294-445zM4981 7844c-155-250-281-457-279-460 5-4 1129-6 1134-1 3 2-519 842-556 895-14 20-29-1-299-434zM8212 7838l-282-453 567-3c311-1 568 0 570 2 5 5-558 906-566 906-4 0-134-204-289-452zM6650 6605v-725h460v1450h-460v-725zM5040 6950v-150h460v300h-460v-150zM8270 6950v-150h460v300h-460v-150zM5102 6431c-125-31-215-84-318-186-144-143-204-286-204-485 0-195 60-340 200-481 72-73 100-93 180-132 393-191 830-5 968 411 22 66 26 95 26 202s-4 136-26 202c-39 118-92 204-178 289-168 167-418 236-648 180zm244-451c86-33 147-124 147-219 0-68-19-116-64-160-115-116-295-85-371 63-16 31-19 54-16 110 3 60 8 78 35 118 57 81 180 121 269 88zM8355 6436c-209-48-377-180-471-370-100-204-100-409 2-616 63-128 180-247 297-303 124-60 220-81 352-75 189 9 339 80 473 223 196 210 238 519 105 785-28 55-60 98-123 161-94 95-156 134-275 175-98 33-264 42-360 20zm242-467c180-87 170-348-17-427-56-23-151-12-202 24-65 46-99 100-105 171-7 75 8 123 56 176 69 76 179 99 268 56zM6750 5516c-270-57-473-255-541-527-18-74-16-239 4-319 31-121 92-226 187-320 87-87 160-132 285-176 73-25 270-31 358-10 247 58 454 265 513 512 21 90 21 240 0 324-57 228-237 420-463 496-94 31-246 40-343 20zm201-457c92-31 159-124 159-220-1-69-25-124-79-172-52-47-81-58-147-58-221 0-314 275-140 412 57 45 140 60 207 38zM4490 4826c-143-26-264-118-330-251l-35-70-3-297-3-298h451v470h1270v460l-642-1c-455-1-662-4-708-13zM7927 4834c-4-4-7-108-7-231v-223l638-2 637-3 3-232 2-233h451l-3 288c-3 273-4 290-26 344-49 122-157 226-281 270l-66 23-670 3c-369 2-674 0-678-4zM6071 3894c-116-31-219-110-279-215-55-97-62-144-62-431v-258h460v473l212-6c116-4 429-7 695-7h483v-460h460v243c0 273-10 341-61 438-57 107-181 201-300 228-28 7-324 10-799 10-627 0-764-3-809-15zM8075 1675c-212-34-413-99-620-200-166-81-295-160-531-323-104-71-220-147-257-167l-67-37 25-46c107-197 350-412 636-565C7731 87 8473-45 8990 30c639 92 1210 456 1565 999 66 101 161 277 183 338l10 31-156 6c-639 25-951 62-1686 197-499 92-641 105-831 74z"
      transform="matrix(.1 0 0 -.1 0 1041)"
    ></path>
  </svg>
);
