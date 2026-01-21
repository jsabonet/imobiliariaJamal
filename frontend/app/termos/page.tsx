import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | IJPS Imobiliária',
  description: 'Termos e condições de uso da plataforma IJPS - Imobiliária Jamal & Prestação de Serviços.',
};

export default function TermosPage() {
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
          <h1 className="text-4xl font-bold text-secondary mb-2">Termos de Uso</h1>
          <p className="text-gray-600">Última atualização: 17 de Janeiro de 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 mb-4">
              Ao acessar e utilizar o site da IJPS - Imobiliária Jamal & Prestação de Serviços
              (<strong>www.imobiliariajamal.com</strong>), você concorda em cumprir e estar vinculado
              aos seguintes termos e condições de uso.
            </p>
            <p className="text-gray-700 mb-4">
              Se você não concordar com qualquer parte destes termos, não deverá usar nosso site ou serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">2. Uso do Site</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">2.1 Licença de Uso</h3>
            <p className="text-gray-700 mb-4">
              Concedemos a você uma licença limitada, não exclusiva e intransferível para acessar e 
              usar nosso site para fins pessoais e não comerciais relacionados à busca, visualização 
              e avaliação de propriedades imobiliárias.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">2.2 Restrições de Uso</h3>
            <p className="text-gray-700 mb-2">Você concorda em NÃO:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Usar o site para qualquer finalidade ilegal ou não autorizada</li>
              <li>Copiar, reproduzir ou distribuir conteúdo do site sem autorização prévia</li>
              <li>Fazer engenharia reversa, descompilar ou tentar extrair código-fonte</li>
              <li>Usar robôs, scrapers ou qualquer ferramenta automatizada sem permissão</li>
              <li>Interferir ou interromper a integridade ou desempenho do site</li>
              <li>Tentar obter acesso não autorizado a qualquer parte do site</li>
              <li>Usar o site para transmitir vírus, malware ou código malicioso</li>
              <li>Publicar conteúdo falso, enganoso, difamatório ou ilegal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">3. Propriedades e Informações</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.1 Precisão das Informações</h3>
            <p className="text-gray-700 mb-4">
              Embora nos esforcemos para garantir a precisão das informações sobre propriedades 
              listadas em nosso site, não garantimos que todas as informações estejam 100% corretas, 
              completas ou atualizadas em tempo real.
            </p>
            <p className="text-gray-700 mb-4">
              Recomendamos sempre verificar as informações diretamente com nossos agentes antes de 
              tomar qualquer decisão de compra ou arrendamento.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.2 Disponibilidade</h3>
            <p className="text-gray-700 mb-4">
              As propriedades listadas estão sujeitas a disponibilidade. Uma propriedade pode ser 
              vendida, arrendada ou removida do mercado sem aviso prévio. A IJPS não se 
              responsabiliza por propriedades que não estejam mais disponíveis.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">3.3 Preços</h3>
            <p className="text-gray-700 mb-4">
              Todos os preços listados estão em Meticais Moçambicanos (MZN) e podem estar sujeitos 
              a alterações sem aviso prévio. Os preços finais serão confirmados durante o processo 
              de negociação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Cadastro e Conta de Usuário</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">4.1 Criação de Conta</h3>
            <p className="text-gray-700 mb-4">
              Algumas funcionalidades do site podem requerer o cadastro de uma conta. Você concorda 
              em fornecer informações verdadeiras, precisas e completas durante o processo de cadastro.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">4.2 Segurança da Conta</h3>
            <p className="text-gray-700 mb-4">
              Você é responsável por manter a confidencialidade de suas credenciais de acesso e por 
              todas as atividades que ocorram sob sua conta. Notifique-nos imediatamente sobre 
              qualquer uso não autorizado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">5. Serviços de Avaliação</h2>
            
            <p className="text-gray-700 mb-4">
              Ao solicitar uma avaliação de imóvel através do site:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Você autoriza a IJPS a entrar em contato via telefone, email ou WhatsApp</li>
              <li>A avaliação inicial é gratuita e não vinculativa</li>
              <li>Uma visita presencial pode ser necessária para avaliação precisa</li>
              <li>O prazo estimado de resposta é de 3-5 dias úteis</li>
              <li>A avaliação fornecida é apenas uma estimativa e não constitui oferta de compra</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">6. Propriedade Intelectual</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">6.1 Direitos Autorais</h3>
            <p className="text-gray-700 mb-4">
              Todo o conteúdo presente no site, incluindo mas não limitado a textos, gráficos, logos, 
              ícones, imagens, fotos de propriedades, vídeos e software, é propriedade da IJPS ou de 
              seus licenciadores e está protegido por leis de direitos autorais moçambicanas e 
              internacionais.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">6.2 Marca Registrada</h3>
            <p className="text-gray-700 mb-4">
              &quot;IJPS&quot;, &quot;Imobiliária Jamal & Prestação de Serviços&quot; e outros logos são marcas
              registradas ou marcas comerciais da empresa. O uso não autorizado é estritamente proibido.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">6.3 Conteúdo do Usuário</h3>
            <p className="text-gray-700 mb-4">
              Ao enviar comentários, avaliações ou qualquer outro conteúdo para o site, você concede 
              à IJPS uma licença mundial, perpétua, irrevogável e livre de royalties para usar, 
              reproduzir e exibir esse conteúdo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">7. Links para Sites de Terceiros</h2>
            
            <p className="text-gray-700 mb-4">
              Nosso site pode conter links para sites de terceiros (bancos, seguradoras, parceiros). 
              Não somos responsáveis pelo conteúdo, políticas de privacidade ou práticas desses sites. 
              O acesso a esses links é por sua conta e risco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">8. Isenção de Responsabilidade</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">8.1 &quot;Como Está&quot;</h3>
            <p className="text-gray-700 mb-4">
              O site e todos os serviços são fornecidos &quot;como estão&quot; e &quot;conforme disponíveis&quot;, sem
              garantias de qualquer tipo, expressas ou implícitas.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">8.2 Limitação de Responsabilidade</h3>
            <p className="text-gray-700 mb-4">
              A IJPS não será responsável por quaisquer danos diretos, indiretos, incidentais,
              especiais ou consequenciais resultantes do uso ou incapacidade de usar o site, incluindo
              mas não limitado a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Perda de lucros ou receitas</li>
              <li>Perda de dados ou informações</li>
              <li>Interrupção do negócio</li>
              <li>Decisões de investimento baseadas em informações do site</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">8.3 Transações Imobiliárias</h3>
            <p className="text-gray-700 mb-4">
              A IJPS atua como intermediária em transações imobiliárias. Não somos parte nas 
              transações entre compradores e vendedores, e não assumimos responsabilidade por:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Documentação legal das propriedades</li>
              <li>Condição física dos imóveis</li>
              <li>Disputas entre partes</li>
              <li>Cumprimento de obrigações contratuais pelas partes</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Recomendamos fortemente a contratação de advogado especializado em direito imobiliário 
              para revisar toda documentação antes de qualquer transação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">9. Indenização</h2>
            
            <p className="text-gray-700 mb-4">
              Você concorda em indenizar e isentar a IJPS, seus diretores, funcionários, agentes e 
              parceiros de qualquer reivindicação, perda, responsabilidade, dano ou despesa (incluindo 
              honorários advocatícios razoáveis) decorrentes de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Seu uso do site</li>
              <li>Violação destes Termos de Uso</li>
              <li>Violação de direitos de terceiros</li>
              <li>Informações falsas ou enganosas fornecidas por você</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">10. Modificações dos Termos</h2>
            
            <p className="text-gray-700 mb-4">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As 
              alterações entrarão em vigor imediatamente após sua publicação no site.
            </p>
            <p className="text-gray-700 mb-4">
              É sua responsabilidade revisar periodicamente estes termos. O uso continuado do site 
              após alterações constitui sua aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">11. Cancelamento e Suspensão</h2>
            
            <p className="text-gray-700 mb-4">
              Podemos, a nosso critério exclusivo, suspender ou cancelar seu acesso ao site, sem aviso 
              prévio, por violação destes termos ou por qualquer outro motivo que consideremos adequado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">12. Lei Aplicável e Jurisdição</h2>
            
            <p className="text-gray-700 mb-4">
              Estes Termos de Uso são regidos e interpretados de acordo com as leis da República de 
              Moçambique.
            </p>
            <p className="text-gray-700 mb-4">
              Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos 
              tribunais da cidade de Maputo, Moçambique.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">13. Disposições Gerais</h2>
            
            <h3 className="text-xl font-semibold text-secondary-light mb-3">13.1 Acordo Completo</h3>
            <p className="text-gray-700 mb-4">
              Estes Termos de Uso, juntamente com nossa Política de Privacidade, constituem o acordo 
              completo entre você e a IJPS em relação ao uso do site.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">13.2 Divisibilidade</h3>
            <p className="text-gray-700 mb-4">
              Se qualquer disposição destes termos for considerada inválida ou inexequível, as 
              disposições restantes continuarão em pleno vigor e efeito.
            </p>

            <h3 className="text-xl font-semibold text-secondary-light mb-3">13.3 Renúncia</h3>
            <p className="text-gray-700 mb-4">
              A falha da IJPS em exercer ou fazer valer qualquer direito ou disposição destes termos 
              não constituirá uma renúncia a esse direito ou disposição.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">14. Contacto</h2>
            
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
              <p className="font-semibold text-secondary mb-2">IJPS - Imobiliária Jamal & Prestação de Serviços</p>
              <p className="text-gray-700 mb-1">📍 Av. Julius Nyerere, Maputo, Moçambique</p>
              <p className="text-gray-700 mb-1">📧 Email: info@ijps.co.mz</p>
              <p className="text-gray-700 mb-1">📱 Telefone: +258 84 000 0000</p>
              <p className="text-gray-700">💬 WhatsApp: +258 84 000 0000</p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              Ao usar nosso site, você confirma que leu, compreendeu e concordou com estes Termos de Uso.
            </p>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-center gap-6">
          <Link 
            href="/privacidade" 
            className="text-primary hover:text-primary-dark font-medium"
          >
            Política de Privacidade →
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
