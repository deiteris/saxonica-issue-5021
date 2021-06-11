<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:Element="http://myns.com/Element"
    exclude-result-prefixes="Element">

  <!-- XSLT 3.0 identity template with HTML5 output -->
  <xsl:mode on-no-match="shallow-copy"/>
  <xsl:output method="html" indent="yes" version="5"/>

  <!-- Region params -->
  <xsl:param name="resolved-doc" select="node()"/>
  <!-- Endregion -->

  <xsl:template match="link//@href">
    <xsl:message>
      <xsl:value-of select="base-uri()"/>
    </xsl:message>
    <xsl:variable name="dirname" select="concat(string-join(tokenize(base-uri(),'/')[position()!=last()],'/'), '/')"/>
    <xsl:attribute name="href">
      <xsl:value-of select="resolve-uri(string(.), $dirname)"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="head">
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>Compiled document</title>
    <xsl:copy>
      <xsl:apply-templates select="link | $resolved-doc//head/link"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="Element:Document">
    <xsl:apply-templates select="$resolved-doc//body/node()"/>
  </xsl:template>

</xsl:stylesheet>
