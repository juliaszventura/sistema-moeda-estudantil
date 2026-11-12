package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import java.util.List;

public record EmailModelo(String titulo, String saudacao, List<String> paragrafos, String destaqueRotulo, String destaque) {

    public static EmailModelo de(String titulo, String saudacao, List<String> paragrafos) {
        return new EmailModelo(titulo, saudacao, paragrafos, null, null);
    }

    public EmailModelo comDestaque(String rotulo, String valor) {
        return new EmailModelo(titulo, saudacao, paragrafos, rotulo, valor);
    }

    public String texto() {
        StringBuilder sb = new StringBuilder();
        sb.append(saudacao).append("\n\n");
        for (String paragrafo : paragrafos) {
            sb.append(paragrafo).append("\n\n");
        }
        if (destaque != null) {
            sb.append(destaqueRotulo).append(": ").append(destaque).append("\n\n");
        }
        sb.append("Moeda Estudantil");
        return sb.toString();
    }

    public String html() {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html lang=\"pt-BR\"><body style=\"margin:0;padding:0;background:#f1f5f9;\">");
        sb.append("<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f1f5f9;padding:24px 12px;\"><tr><td align=\"center\">");
        sb.append("<table role=\"presentation\" width=\"560\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;\">");
        sb.append("<tr><td style=\"background:#2f7d8a;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold;\">Moeda Estudantil</td></tr>");
        sb.append("<tr><td style=\"padding:28px;color:#334155;font-size:15px;line-height:1.6;\">");
        sb.append("<h1 style=\"margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#0f172a;\">").append(esc(titulo)).append("</h1>");
        sb.append("<p style=\"margin:0 0 16px 0;\">").append(esc(saudacao)).append("</p>");
        for (String paragrafo : paragrafos) {
            sb.append("<p style=\"margin:0 0 16px 0;\">").append(esc(paragrafo)).append("</p>");
        }
        if (destaque != null) {
            sb.append("<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:8px 0 20px 0;\"><tr>");
            sb.append("<td align=\"center\" style=\"background:#eef6f7;border:2px dashed #7fb5be;border-radius:12px;padding:18px;\">");
            sb.append("<div style=\"font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;\">").append(esc(destaqueRotulo)).append("</div>");
            sb.append("<div style=\"font-family:'Courier New',monospace;font-size:28px;font-weight:bold;letter-spacing:4px;color:#1f5f6b;\">").append(esc(destaque)).append("</div>");
            sb.append("</td></tr></table>");
        }
        sb.append("</td></tr>");
        sb.append("<tr><td style=\"padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;\">Mensagem automática do sistema Moeda Estudantil. Não responda a este e-mail.</td></tr>");
        sb.append("</table></td></tr></table></body></html>");
        return sb.toString();
    }

    private static String esc(String valor) {
        if (valor == null) return "";
        return valor.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
