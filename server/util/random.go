package util

import (
	"math/rand"
	"strings"
	"time"
)

const (
	alphabets = "abcdefghijklmnopqrst"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func RandomString(n int) string {
	var sb strings.Builder
	k := len(alphabets)

	for i := 0; i < n; i++ {
		c := alphabets[rand.Intn(k)]
		sb.WriteByte(c)
	}

	return sb.String()
}
