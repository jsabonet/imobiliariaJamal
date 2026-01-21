import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | IJPS Imobiliária',
  description: 'Política de privacidade e proteção de dados da IJPS - Imobiliária Jamal & Prestação de Serviços.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <Link 
            href="/" 
            className="text-primary hover:text-primary-dark text-sm mb-4 inline-block"
          >
            ← Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-secondary mb-2">Política de Privacidade</h1>
          <p className="text-gray-600">Última atualização: 17 de Janeiro de 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Introdução</h2>
            <p className="text-gray-700 mb-4">
              A IJPS - Imobiliária Jamal & Prestação de Serviços (&quot;IJPS&quot;, &quot;nós&quot;, &quot;nosso&quot;) está 
              comprometida em proteger a privacidade e segurança dos dados pessoais de nossos clientes, 
              usuários e visitantes do site.
            </p>
            <p className="text-gray-700 mb-4">
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
              suas informações pessoais quando você utiliza nosso site (<strong>www.imobiliariajamal.com</strong>)
              e nossos serviços.
            </p>
            <p className="text-gray-700 mb-4">
              Ao usar nosso site e serviços, você concorda com as práticas descritas nesta política.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">2. Informações que Coletamos</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">2.1 Informações Fornecidas Diretamente</h3>
            <p className="text-gray-700 mb-2">Coletamos informações que você nos fornece voluntariamente, incluindo:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Dados de Identificação:</strong> Nome completo, data de nascimento, número de identificação</li>
              <li><strong>Dados de Contacto:</strong> Email, número de telefone, endereço postal, WhatsApp</li>
              <li><strong>Informações de Propriedade:</strong> Detalhes sobre imóveis que deseja vender, comprar ou arrendar</li>
              <li><strong>Preferências:</strong> Tipo de propriedade, localização, faixa de preço, características desejadas</li>
              <li><strong>Informações Financeiras:</strong> Orçamento, capacidade de pagamento (para qualificação)</li>
              <li><strong>Documentos:</strong> Cópias de documentos de identificação, comprovativo de residência (quando aplicável)</li>
              <li><strong>Comunicações:</strong> Conteúdo de emails, mensagens e chamadas trocadas conosco</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">2.2 Informações Coletadas Automaticamente</h3>
            <p className="text-gray-700 mb-2">Quando você visita nosso site, coletamos automaticamente:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
              <li><strong>Dados de Acesso:</strong> Páginas visitadas, tempo de permanência, links clicados</li>
              <li><strong>Dados de Dispositivo:</strong> Tipo de dispositivo, identificador único, operadora móvel</li>
              <li><strong>Localização:</strong> Localização geográfica aproximada (baseada em IP)</li>
              <li><strong>Cookies:</strong> Informações armazenadas através de cookies e tecnologias similares</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">2.3 Informações de Terceiros</h3>
            <p className="text-gray-700 mb-4">
              Podemos receber informações sobre você de terceiros, como:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Redes sociais (se você conectar sua conta)</li>
              <li>Parceiros de negócios (bancos, seguradoras)</li>
              <li>Registros públicos e bases de dados comerciais</li>
              <li>Serviços de análise e marketing digital (Google Analytics, Facebook Pixel)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">3. Como Usamos Suas Informações</h2>
            
            <p className="text-gray-700 mb-4">Utilizamos suas informações pessoais para:</p>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.1 Prestação de Serviços</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Processar solicitações de avaliação de imóveis</li>
              <li>Apresentar propriedades que correspondam às suas preferências</li>
              <li>Agendar visitas e reuniões</li>
              <li>Facilitar transações de compra, venda ou arrendamento</li>
              <li>Fornecer suporte ao cliente e responder a perguntas</li>
              <li>Processar pagamentos e comissões</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.2 Comunicação</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Enviar notificações sobre novas propriedades</li>
              <li>Alertas de preço e atualizações de mercado</li>
              <li>Newsletter com dicas e insights imobiliários</li>
              <li>Confirmações de agendamentos e transações</li>
              <li>Pesquisas de satisfação</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.3 Melhoria e Personalização</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Personalizar sua experiência no site</li>
              <li>Recomendar propriedades relevantes</li>
              <li>Melhorar nossos serviços e funcionalidades</li>
              <li>Analisar tendências de uso e comportamento</li>
              <li>Realizar testes A/B e otimizações</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.4 Marketing e Publicidade</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Enviar ofertas e promoções especiais</li>
              <li>Exibir anúncios relevantes (remarketing)</li>
              <li>Conduzir campanhas de marketing digital</li>
              <li>Criar audiências personalizadas (lookalike)</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.5 Segurança e Compliance</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Prevenir fraudes e atividades suspeitas</li>
              <li>Proteger a segurança do site e usuários</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Resolver disputas e fazer cumprir contratos</li>
              <li>Manter registros para fins de auditoria</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Base Legal para Processamento</h2>
            
            <p className="text-gray-700 mb-4">
              Processamos seus dados pessoais com base em:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Consentimento:</strong> Quando você nos fornece permissão explícita</li>
              <li><strong>Contrato:</strong> Para executar serviços que você solicitou</li>
              <li><strong>Obrigação Legal:</strong> Para cumprir leis e regulamentos aplicáveis</li>
              <li><strong>Interesses Legítimos:</strong> Para melhorar serviços e prevenir fraudes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">5. Compartilhamento de Informações</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">5.1 Compartilhamento Autorizado</h3>
            <p className="text-gray-700 mb-2">Podemos compartilhar suas informações com:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Agentes Imobiliários:</strong> Nossos agentes internos para prestar serviços</li>
              <li><strong>Proprietários/Compradores:</strong> Informações necessárias para transações (com sua autorização)</li>
              <li><strong>Prestadores de Serviços:</strong> Empresas que nos auxiliam (hosting, email, CRM, pagamentos)</li>
              <li><strong>Parceiros Comerciais:</strong> Bancos, seguradoras, advogados (com seu consentimento)</li>
              <li><strong>Agências de Marketing:</strong> Para executar campanhas publicitárias</li>
              <li><strong>Ferramentas de Análise:</strong> Google Analytics, Facebook Pixel (dados anonimizados)</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">5.2 Exigências Legais</h3>
            <p className="text-gray-700 mb-4">
              Podemos divulgar suas informações quando exigido por lei, ordem judicial, processo legal 
              ou autoridades governamentais.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">5.3 Transferências Comerciais</h3>
            <p className="text-gray-700 mb-4">
              Em caso de fusão, aquisição ou venda de ativos, suas informações podem ser transferidas 
              para a nova entidade, mantendo-se as mesmas proteções de privacidade.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">5.4 Não Vendemos Seus Dados</h3>
            <p className="text-gray-700 mb-4 font-semibold">
              A IJPS NÃO vende, aluga ou comercializa seus dados pessoais para terceiros não afiliados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">6. Cookies e Tecnologias de Rastreamento</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">6.1 O Que São Cookies</h3>
            <p className="text-gray-700 mb-4">
              Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita 
              nosso site. Eles nos ajudam a melhorar sua experiência e entender como você usa o site.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">6.2 Tipos de Cookies Que Usamos</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento do site (login, carrinho)</li>
              <li><strong>Cookies de Performance:</strong> Coletam dados sobre uso do site (Google Analytics)</li>
              <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências (idioma, filtros)</li>
              <li><strong>Cookies de Marketing:</strong> Rastreiam sua navegação para exibir anúncios relevantes</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">6.3 Gerenciar Cookies</h3>
            <p className="text-gray-700 mb-4">
              Você pode controlar cookies através das configurações do seu navegador. Note que 
              desabilitar cookies pode afetar a funcionalidade do site.
            </p>
            <p className="text-gray-700 mb-4">
              Para mais informações sobre cookies: <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.allaboutcookies.org</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">7. Segurança dos Dados</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">7.1 Medidas de Segurança</h3>
            <p className="text-gray-700 mb-4">Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Criptografia:</strong> SSL/TLS para transmissão segura de dados</li>
              <li><strong>Controle de Acesso:</strong> Acesso restrito apenas a pessoal autorizado</li>
              <li><strong>Backups:</strong> Backups regulares de dados</li>
              <li><strong>Monitoramento:</strong> Sistemas de detecção de intrusão</li>
              <li><strong>Treinamento:</strong> Equipe treinada em segurança e privacidade</li>
              <li><strong>Atualização:</strong> Software e sistemas sempre atualizados</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">7.2 Limitações</h3>
            <p className="text-gray-700 mb-4">
              Apesar de nossos esforços, nenhum sistema é 100% seguro. Não podemos garantir a segurança 
              absoluta das informações transmitidas pela internet. Use senhas fortes e não as compartilhe.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">7.3 Violação de Dados</h3>
            <p className="text-gray-700 mb-4">
              Em caso de violação de segurança que afete seus dados pessoais, notificaremos você e as 
              autoridades competentes conforme exigido pela lei moçambicana.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">8. Retenção de Dados</h2>
            
            <p className="text-gray-700 mb-4">
              Mantemos suas informações pessoais pelo tempo necessário para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Prestar os serviços solicitados</li>
              <li>Cumprir obrigações legais e contratuais</li>
              <li>Resolver disputas e fazer cumprir acordos</li>
              <li>Manter registros de auditoria conforme exigido por lei</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Períodos típicos de retenção:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Dados de transações: 10 anos (conformidade fiscal)</li>
              <li>Comunicações: 3 anos</li>
              <li>Dados de marketing: Até você retirar consentimento</li>
              <li>Dados de navegação: 24 meses</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Após os períodos de retenção, seus dados serão deletados ou anonimizados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">9. Seus Direitos</h2>
            
            <p className="text-gray-700 mb-4">Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.1 Direito de Acesso</h3>
            <p className="text-gray-700 mb-4">
              Solicitar uma cópia dos dados pessoais que mantemos sobre você.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.2 Direito de Retificação</h3>
            <p className="text-gray-700 mb-4">
              Corrigir dados incompletos, imprecisos ou desatualizados.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.3 Direito de Eliminação</h3>
            <p className="text-gray-700 mb-4">
              Solicitar a exclusão de seus dados pessoais (sujeito a obrigações legais de retenção).
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.4 Direito de Limitação</h3>
            <p className="text-gray-700 mb-4">
              Solicitar restrição do processamento de seus dados em certas circunstâncias.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.5 Direito de Portabilidade</h3>
            <p className="text-gray-700 mb-4">
              Receber seus dados em formato estruturado e legível por máquina.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.6 Direito de Oposição</h3>
            <p className="text-gray-700 mb-4">
              Opor-se ao processamento de seus dados para marketing direto.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.7 Direito de Retirar Consentimento</h3>
            <p className="text-gray-700 mb-4">
              Retirar seu consentimento a qualquer momento (não afeta processamento prévio).
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">9.8 Como Exercer Seus Direitos</h3>
            <p className="text-gray-700 mb-4">
              Para exercer qualquer destes direitos, entre em contato conosco através de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Email: privacidade@ijps.co.mz</li>
              <li>Telefone: +258 84 000 0000</li>
              <li>Formulário de contato no site</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Responderemos à sua solicitação em até 30 dias. Podemos solicitar verificação de 
              identidade antes de processar sua solicitação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">10. Marketing e Comunicações</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">10.1 Opt-in e Opt-out</h3>
            <p className="text-gray-700 mb-4">
              Você pode optar por receber ou não comunicações de marketing. Para cancelar:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Clique em &quot;Cancelar inscrição&quot; em qualquer email</li>
              <li>Ajuste preferências na sua conta</li>
              <li>Entre em contato conosco</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Nota:</strong> Você continuará recebendo comunicações transacionais essenciais 
              (confirmações, atualizações de transações) mesmo após opt-out de marketing.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">10.2 Frequência de Comunicação</h3>
            <p className="text-gray-700 mb-4">
              Enviamos no máximo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Newsletter: 1x por semana</li>
              <li>Alertas de propriedades: Conforme disponibilidade</li>
              <li>Ofertas especiais: 2x por mês</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">11. Privacidade de Crianças</h2>
            
            <p className="text-gray-700 mb-4">
              Nosso site e serviços não são direcionados a menores de 18 anos. Não coletamos 
              intencionalmente informações de crianças.
            </p>
            <p className="text-gray-700 mb-4">
              Se descobrirmos que coletamos dados de uma criança sem o consentimento verificável dos 
              pais, tomaremos medidas para deletar essas informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">12. Links para Sites de Terceiros</h2>
            
            <p className="text-gray-700 mb-4">
              Nosso site pode conter links para sites de terceiros (bancos, parceiros). Não somos 
              responsáveis pelas práticas de privacidade desses sites. Recomendamos ler suas políticas 
              de privacidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">13. Transferências Internacionais</h2>
            
            <p className="text-gray-700 mb-4">
              Alguns de nossos prestadores de serviços estão localizados fora de Moçambique 
              (ex: servidores de hosting, ferramentas de email marketing).
            </p>
            <p className="text-gray-700 mb-4">
              Garantimos que qualquer transferência internacional de dados seja feita em conformidade 
              com as leis aplicáveis e com salvaguardas apropriadas (cláusulas contratuais padrão, 
              certificações de privacidade).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">14. Alterações a Esta Política</h2>
            
            <p className="text-gray-700 mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em 
              nossas práticas ou por requisitos legais.
            </p>
            <p className="text-gray-700 mb-4">
              Alterações significativas serão comunicadas através de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Aviso destacado no site</li>
              <li>Email (se você estiver inscrito)</li>
              <li>Notificação no app/conta</li>
            </ul>
            <p className="text-gray-700 mb-4">
              A data de &quot;Última atualização&quot; no topo desta página indica quando a política foi revisada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">15. Legislação Aplicável</h2>
            
            <p className="text-gray-700 mb-4">
              Esta Política de Privacidade é regida pelas leis de proteção de dados de Moçambique, 
              incluindo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Lei de Proteção de Dados Pessoais (Lei nº 26/2019)</li>
              <li>Regulamentações da Autoridade Nacional de Proteção de Dados (ANPPD)</li>
              <li>Outras legislações aplicáveis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">16. Contacto e Reclamações</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">16.1 Encarregado de Proteção de Dados</h3>
            <p className="text-gray-700 mb-4">
              Para questões relacionadas à privacidade e proteção de dados:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4 mb-6">
              <p className="font-semibold text-secondary mb-2">Encarregado de Proteção de Dados</p>
              <p className="text-gray-700 mb-1">📧 Email: privacidade@ijps.co.mz</p>
              <p className="text-gray-700 mb-1">📱 Telefone: +258 84 000 0000</p>
              <p className="text-gray-700">📍 Endereço: Av. Julius Nyerere, Maputo, Moçambique</p>
            </div>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">16.2 Autoridade de Supervisão</h3>
            <p className="text-gray-700 mb-4">
              Se não estiver satisfeito com nossa resposta, você pode apresentar reclamação à:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
              <p className="font-semibold text-secondary mb-2">Autoridade Nacional de Proteção de Dados (ANPPD)</p>
              <p className="text-gray-700 mb-1">🌐 Website: [URL da ANPPD]</p>
              <p className="text-gray-700">📧 Email: [Email da ANPPD]</p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              Ao usar nosso site e serviços, você confirma que leu e compreendeu esta Política de Privacidade.
            </p>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-center gap-6">
          <Link 
            href="/termos" 
            className="text-primary hover:text-primary-dark font-medium"
          >
            Termos de Uso →
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-secondary font-medium"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
