#!/bin/zsh
# d2.sh file y0 y1 [mode]
node /Users/riyaghosh/V3/siena/recon/conversion/dump.cjs $1 $2 $3 ${4:-tb} | grep -v -E '^B (DIV|BUTTON|SPAN|A) \| -|cookieyes|We value|We use cookies|"Customize"|Reject All|Accept All|B INPUT \| (355|588)|B IMG \| (382|321|548|609)|960,602|Menu Area|Menu Cluster|Menu Footer|Mini - Icon|Products|Extra Column|Desktop|Column < |"Column"|Variant 1" \| (446|732|1017)|B VIDEO \| (507|113)|"Closed"|"Links"|Tab <|"Tab"|Latest blog|Click Area|\[ICON|\[Link < ICON|"Name" \| (213|608|949|705|685)' | cut -c1-${5:-330}
